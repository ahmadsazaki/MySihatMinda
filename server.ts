import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import { v4 as uuidv4 } from 'uuid';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  const CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end my life", "self-harm", "jump",
    "bunuh diri", "mencederakan diri", "tamatkan nyawa", "terjun",
    "自杀", "自残", "不想活了",
    "தற்கொலை", "இறக்க வேண்டும்"
  ];

  const containsCrisisKeywords = (text: string) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User Auth / Profile
  app.post("/api/user/init", (req, res) => {
    const { authId, language, state, ageRange, consentGiven } = req.body;
    try {
      const existing = db.prepare('SELECT * FROM users WHERE authId = ?').get(authId) as any;
      if (existing) {
        existing.consentGiven = !!existing.consentGiven;
        return res.json(existing);
      }
      const userId = uuidv4();
      db.prepare('INSERT INTO users (userId, authId, language, state, ageRange, consentGiven) VALUES (?, ?, ?, ?, ?, ?)')
        .run(userId, authId, language, state, ageRange, consentGiven ? 1 : 0);
      
      const newUser = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId) as any;
      if (newUser) newUser.consentGiven = !!newUser.consentGiven;
      res.json(newUser);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/api/user/:authId", (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE authId = ?').get(req.params.authId) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    user.consentGiven = !!user.consentGiven;
    res.json(user);
  });

  app.post("/api/user/settings", (req, res) => {
    const { userId, aiModel, language } = req.body;
    if (aiModel) db.prepare('UPDATE users SET aiModel = ? WHERE userId = ?').run(aiModel, userId);
    if (language) db.prepare('UPDATE users SET language = ? WHERE userId = ?').run(language, userId);
    res.json({ success: true });
  });

  // LLM Chat via OpenRouter
  app.post("/api/chat", async (req, res) => {
    const { userId, message, history } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId) as any;
    if (!user) return res.status(404).json({ error: "User not found" });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OpenRouter API Key not configured" });

    const systemPrompt = `You are MySihat Mind, an AI-powered mental health companion. 
    Your tone is calm, supportive, and non-judgmental. 
    You are NOT a doctor. You provide emotional support and guidance.
    If the user expresses self-harm or crisis, you MUST encourage them to contact professional help immediately.
    Current User Language: ${user.language}. Please respond in that language.
    User Context: State ${user.state}, Age Range ${user.ageRange}.`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "MySihat Mind",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: user.aiModel || "openrouter/free",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
          ]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "OpenRouter Error");
      
      const aiResponse = data.choices[0].message.content;
      res.json({ response: aiResponse });
    } catch (err) {
      console.error("Chat Error:", err);
      res.status(500).json({ error: "Failed to connect to AI service" });
    }
  });

  // Screening
  app.post("/api/screening/submit", (req, res) => {
    const { userId, type, responses, freeText } = req.body; // responses: [{q: 1, v: 3}, ...]
    try {
      const totalScore = responses.reduce((acc: number, r: any) => acc + r.v, 0);
      let severity = "Low";
      if (totalScore >= 15) severity = "Crisis";
      else if (totalScore >= 10) severity = "High";
      else if (totalScore >= 5) severity = "Moderate";

      const hasKeywords = containsCrisisKeywords(freeText || "");
      if (hasKeywords) severity = "Crisis";

      const screeningId = uuidv4();
      const crisisFlag = severity === "Crisis" ? 1 : 0;

      db.prepare('INSERT INTO screenings (screeningId, userId, type, finalScore, severity, crisisFlag) VALUES (?, ?, ?, ?, ?, ?)')
        .run(screeningId, userId, type, totalScore, severity, crisisFlag);

      const insertResponse = db.prepare('INSERT INTO responses (responseId, screeningId, qNumber, answerValue) VALUES (?, ?, ?, ?)');
      responses.forEach((r: any) => {
        insertResponse.run(uuidv4(), screeningId, r.q, r.v);
      });

      if (crisisFlag) {
        db.prepare('INSERT INTO crisis_events (crisisId, userId, trigger, escalation) VALUES (?, ?, ?, ?)')
          .run(uuidv4(), userId, hasKeywords ? `Keyword: ${freeText}` : `Score: ${totalScore}`, 1);
      }

      res.json({ screeningId, totalScore, severity, crisisFlag });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Programs
  app.get("/api/programs/day/:day", (req, res) => {
    const program = db.prepare('SELECT * FROM micro_programs WHERE dayNumber = ?').get(req.params.day);
    res.json(program);
  });

  app.get("/api/user/:userId/progress", (req, res) => {
    const progress = db.prepare('SELECT dayNumber FROM daily_modules WHERE userId = ? ORDER BY dayNumber DESC LIMIT 1').get(req.params.userId) as any;
    
    // Calculate streak
    const completions = db.prepare('SELECT DATE(completionDt) as date FROM daily_modules WHERE userId = ? ORDER BY completionDt DESC').all(req.params.userId) as { date: string }[];
    
    let streak = 0;
    if (completions.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let lastDate = completions[0].date;
      if (lastDate === today || lastDate === yesterday) {
        streak = 1;
        for (let i = 1; i < completions.length; i++) {
          const prevDate = new Date(new Date(lastDate).getTime() - 86400000).toISOString().split('T')[0];
          if (completions[i].date === prevDate) {
            streak++;
            lastDate = completions[i].date;
          } else if (completions[i].date === lastDate) {
            continue; // Same day multiple completions
          } else {
            break;
          }
        }
      }
    }

    res.json({ 
      lastDay: progress ? progress.dayNumber : 0,
      streak 
    });
  });

  app.post("/api/user/progress/complete", (req, res) => {
    const { userId, dayNumber, reflectionText } = req.body;
    const assignmentId = uuidv4();
    
    const hasKeywords = containsCrisisKeywords(reflectionText || "");
    if (hasKeywords) {
      db.prepare('INSERT INTO crisis_events (crisisId, userId, trigger, escalation) VALUES (?, ?, ?, ?)')
        .run(uuidv4(), userId, `Keyword in Reflection: ${reflectionText}`, 1);
    }

    db.prepare('INSERT INTO daily_modules (assignmentId, userId, dayNumber, status, completionDt, reflectionText) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)')
      .run(assignmentId, userId, dayNumber, 'Completed', reflectionText || '');
    res.json({ success: true, crisisTriggered: hasKeywords });
  });

  app.get("/api/user/:userId/reflections", (req, res) => {
    const reflections = db.prepare('SELECT dayNumber, reflectionText, completionDt FROM daily_modules WHERE userId = ? AND reflectionText != "" ORDER BY dayNumber DESC').all(req.params.userId);
    res.json(reflections);
  });

  // NGOs
  app.get("/api/ngos", (req, res) => {
    const ngos = db.prepare('SELECT * FROM ngo_partners').all();
    res.json(ngos);
  });

  // Admin Stats
  app.get("/api/admin/stats", (req, res) => {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const severityStats = db.prepare('SELECT severity, COUNT(*) as count FROM screenings GROUP BY severity').all();
    const crisisEvents = db.prepare('SELECT COUNT(*) as count FROM crisis_events').get() as any;
    res.json({ totalUsers: totalUsers.count, severityStats, crisisEvents: crisisEvents.count });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();
export default appPromise;
