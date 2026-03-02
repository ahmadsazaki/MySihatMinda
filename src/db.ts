import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';
const dbPath = isProd ? '/tmp/mysihat.db' : 'mysihat.db';

console.log(`[DB] Initializing database at: ${dbPath} (isProd: ${isProd})`);

// In production, we might need to copy the initial DB if it exists, 
// but since we initialize it here, we just use /tmp
const db = new Database(dbPath);

// Initialize schema
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      userId TEXT PRIMARY KEY,
      authId TEXT UNIQUE,
      language TEXT,
      consentGiven INTEGER,
      state TEXT,
      ageRange TEXT,
      aiModel TEXT DEFAULT 'openrouter/free',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS screenings (
      screeningId TEXT PRIMARY KEY,
      userId TEXT,
      type TEXT,
      finalScore INTEGER,
      severity TEXT,
      crisisFlag INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(userId)
    );

    CREATE TABLE IF NOT EXISTS responses (
      responseId TEXT PRIMARY KEY,
      screeningId TEXT,
      qNumber INTEGER,
      answerValue INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(screeningId) REFERENCES screenings(screeningId)
    );

    CREATE TABLE IF NOT EXISTS micro_programs (
      programId INTEGER PRIMARY KEY,
      dayNumber INTEGER,
      exercise TEXT,
      reflection TEXT,
      breathing TEXT
    );

    CREATE TABLE IF NOT EXISTS daily_modules (
      assignmentId TEXT PRIMARY KEY,
      userId TEXT,
      dayNumber INTEGER,
      status TEXT,
      completionDt DATETIME,
      reflectionText TEXT,
      FOREIGN KEY(userId) REFERENCES users(userId)
    );
  `);

  // Ensure columns exist (migration for older databases)
  const dailyModulesInfo = db.prepare("PRAGMA table_info(daily_modules)").all() as any[];
  if (!dailyModulesInfo.some(col => col.name === 'reflectionText')) {
    db.exec("ALTER TABLE daily_modules ADD COLUMN reflectionText TEXT;");
  }
  if (!dailyModulesInfo.some(col => col.name === 'completionDt')) {
    db.exec("ALTER TABLE daily_modules ADD COLUMN completionDt DATETIME;");
  }

  const usersInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
  if (!usersInfo.some(col => col.name === 'aiModel')) {
    db.exec("ALTER TABLE users ADD COLUMN aiModel TEXT DEFAULT 'openrouter/free';");
  }
  if (!usersInfo.some(col => col.name === 'consentGiven')) {
    db.exec("ALTER TABLE users ADD COLUMN consentGiven INTEGER;");
  }
  if (!usersInfo.some(col => col.name === 'state')) {
    db.exec("ALTER TABLE users ADD COLUMN state TEXT;");
  }
  if (!usersInfo.some(col => col.name === 'ageRange')) {
    db.exec("ALTER TABLE users ADD COLUMN ageRange TEXT;");
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS ngo_partners (
      ngoId TEXT PRIMARY KEY,
      name TEXT,
      state TEXT,
      contact TEXT
    );

    CREATE TABLE IF NOT EXISTS crisis_events (
      crisisId TEXT PRIMARY KEY,
      userId TEXT,
      trigger TEXT,
      escalation INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(userId)
    );
  `);
} catch (err) {
  console.error("[DB] Schema initialization/migration error:", err);
}

// Seed static data for Micro Programs (21 days)
const programsCount = db.prepare('SELECT COUNT(*) as count FROM micro_programs').get() as { count: number };
if (programsCount.count === 0) {
  const insertProgram = db.prepare('INSERT INTO micro_programs (dayNumber, exercise, reflection, breathing) VALUES (?, ?, ?, ?)');
  const programs = [
    [1, "Mindfulness log: Notice one thing you often do on 'autopilot'.", "How did it feel to pause?", "N/A"],
    [2, "4-7-8 Breathing: Start with 3 deep breaths before a task.", "Any change in tension?", "Inhale 4s, Hold 7s, Exhale 8s"],
    [3, "Gratitude listing: Identify 3 small things you are grateful for.", "What made you smile?", "N/A"],
    [4, "Active stretching: Take a 5-minute walk outside or stretch.", "How does your body feel?", "N/A"],
    [5, "5-4-3-2-1 Grounding: Name 5 things you see, 4 you feel, 3 you hear.", "Do you feel more present?", "N/A"],
    [6, "Sensory hydration: Drink a glass of water mindfully.", "Did you notice the taste?", "N/A"],
    [7, "Digital detox: Unplug from screens 30 mins before bed.", "How was your sleep quality?", "N/A"],
    [8, "Value-aligned action: Identify one value (e.g., Kindness) to focus on.", "How did it feel to act on it?", "N/A"],
    [9, "Self-affirmation: Say one kind thing to yourself in the mirror.", "Was it difficult to do?", "N/A"],
    [10, "Social outreach: Send a short text to a friend or family.", "How did the interaction feel?", "N/A"],
    [11, "Boundary setting: Identify one 'No' you need to say today.", "Did you feel more in control?", "N/A"],
    [12, "Task tackling: Complete one small task you've avoided.", "How is your energy now?", "N/A"],
    [13, "Nature observation: Spend 5 mins looking at a plant or the sky.", "Notice any colors/patterns?", "N/A"],
    [14, "Intentional listening: Listen to one song that makes you feel calm.", "How did the rhythm affect you?", "N/A"],
    [15, "Letting go visualization: Release one small frustration from today.", "Do you feel lighter?", "N/A"],
    [16, "Creative expression: Doodle or write a short poem for 5 mins.", "What did you discover?", "N/A"],
    [17, "Mindful eating: Eat one meal without any distractions.", "Did the food taste different?", "N/A"],
    [18, "Win-listing: List two things you are proud of achieving.", "How does it impact your mood?", "N/A"],
    [19, "Cognitive reframing: Reframe one negative thought into neutral.", "Does it feel more manageable?", "N/A"],
    [20, "Altruistic action: Do one small act of kindness for someone else.", "How did they respond?", "N/A"],
    [21, "Journey review: Look back at the last 20 days.", "What habit will you keep?", "N/A"]
  ];
  programs.forEach(p => insertProgram.run(p[0], p[1], p[2], p[3]));
}

// Seed NGO Partners
const ngoCount = db.prepare('SELECT COUNT(*) as count FROM ngo_partners').get() as { count: number };
if (ngoCount.count === 0) {
  const insertNGO = db.prepare('INSERT INTO ngo_partners (ngoId, name, state, contact) VALUES (?, ?, ?, ?)');
  const ngos = [
    [uuidv4(), 'Befrienders KL', 'Selangor', '03-76272929'],
    [uuidv4(), 'MIASA', 'Selangor', '1-800-820066'],
    [uuidv4(), 'Talian Kasih', 'National', '15999'],
    [uuidv4(), 'Relate Malaysia', 'Online', 'relate.com.my']
  ];
  ngos.forEach(n => insertNGO.run(n[0], n[1], n[2], n[3]));
}

export default db;
