/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Heart, 
  Shield, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  Wind, 
  BookOpen,
  Globe,
  Phone,
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { Language, Severity, User, ScreeningResult, MicroProgram, NGO } from './types';
import { TRANSLATIONS } from './constants';

type AppMode = 'Welcome' | 'Language' | 'Onboarding' | 'Consent' | 'Profile' | 'Dashboard' | 'Screening' | 'Result' | 'Program' | 'Referral' | 'Admin' | 'Journal' | 'Settings' | 'Chat';

interface ProfileFormProps {
  onNext: (state: string, ageRange: string) => void;
  t: any;
}

const ProfileForm = ({ onNext, t }: ProfileFormProps) => {
  const [state, setState] = useState('');
  const [age, setAge] = useState('');
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen p-6 bg-stone-50"
    >
      <h2 className="text-2xl font-bold text-stone-900 mt-12 mb-8">{t.profileTitle}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">{t.stateLabel}</label>
          <select 
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">{t.selectState}</option>
            <option value="Johor">{t.states.Johor}</option>
            <option value="Kedah">{t.states.Kedah}</option>
            <option value="Kelantan">{t.states.Kelantan}</option>
            <option value="Melaka">{t.states.Melaka}</option>
            <option value="Negeri Sembilan">{t.states.NegeriSembilan}</option>
            <option value="Pahang">{t.states.Pahang}</option>
            <option value="Perak">{t.states.Perak}</option>
            <option value="Perlis">{t.states.Perlis}</option>
            <option value="Pulau Pinang">{t.states.PulauPinang}</option>
            <option value="Sabah">{t.states.Sabah}</option>
            <option value="Sarawak">{t.states.Sarawak}</option>
            <option value="Selangor">{t.states.Selangor}</option>
            <option value="Terengganu">{t.states.Terengganu}</option>
            <option value="Kuala Lumpur">{t.states.KualaLumpur}</option>
            <option value="Labuan">{t.states.Labuan}</option>
            <option value="Putrajaya">{t.states.Putrajaya}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">{t.ageRangeLabel}</label>
          <select 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">{t.selectAge}</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45+">45+</option>
          </select>
        </div>
      </div>
      <div className="mt-auto pb-8">
        <button 
          disabled={!state || !age}
          onClick={() => onNext(state, age)}
          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-semibold disabled:opacity-50 shadow-lg"
        >
          {t.next}
        </button>
      </div>
    </motion.div>
  );
};

interface BreathingCircleProps {
  onComplete?: () => void;
  t: any;
}

const BreathingCircle = ({ onComplete, t }: BreathingCircleProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        if (phase === 'Inhale') {
          setPhase('Hold');
          setCount(7);
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          setCount(8);
        } else {
          setPhase('Inhale');
          setCount(4);
          setCycles(prev => prev + 1);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isActive, phase, count]);

  return (
    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-blue-600">
          <Wind size={20} />
          <h4 className="font-bold uppercase tracking-wider text-xs">{t.breathingTitle}</h4>
        </div>
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{t.cycle} {cycles}</span>
      </div>

      <div className="relative flex items-center justify-center w-48 h-48">
        <motion.div
          animate={{
            scale: !isActive ? 1 : phase === 'Inhale' ? 1.5 : phase === 'Hold' ? 1.5 : 1,
            backgroundColor: phase === 'Inhale' ? 'rgba(96, 165, 250, 0.2)' : phase === 'Hold' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(96, 165, 250, 0.1)',
          }}
          transition={{
            duration: !isActive ? 0.5 : phase === 'Inhale' ? 4 : phase === 'Exhale' ? 8 : 0,
            ease: "linear"
          }}
          className="absolute w-32 h-32 rounded-full border-4 border-blue-400"
        />
        <div className="relative z-10 text-center">
          <div className="text-4xl font-bold text-blue-600 font-mono">{isActive ? count : '--'}</div>
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">
            {isActive ? (
              phase === 'Inhale' ? t.inhale : phase === 'Hold' ? t.hold : t.exhale
            ) : t.ready}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className={`mt-8 px-8 py-3 rounded-2xl font-bold transition-all ${
          isActive ? 'bg-white text-blue-600 border border-blue-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        }`}
      >
        {isActive ? t.pause : t.startBreathing}
      </button>

      <p className="mt-4 text-[10px] text-blue-400 text-center leading-relaxed max-w-[200px]">
        {t.breathingGuide}
      </p>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<AppMode>('Welcome');
  const [lang, setLang] = useState<Language>(Language.EN);
  const [user, setUser] = useState<User | null>(null);
  const [screeningType, setScreeningType] = useState<'PHQ-9' | 'GAD-7'>('PHQ-9');
  const [screeningAnswers, setScreeningAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [programDay, setProgramDay] = useState<MicroProgram | null>(null);
  const [userProgress, setUserProgress] = useState<{ lastDay: number, streak: number }>({ lastDay: 0, streak: 0 });
  const [reflection, setReflection] = useState('');
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const savedAuthId = localStorage.getItem('authId');
    if (savedAuthId) {
      fetch(`/api/user/${savedAuthId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setUser(data);
            setLang(data.language as Language);
            setMode('Dashboard');
            fetchProgress(data.userId);
          }
        });
    }
  }, []);

  const fetchProgress = async (userId: string) => {
    const res = await fetch(`/api/user/${userId}/progress`);
    const data = await res.json();
    setUserProgress(data);
  };

  const handleInitUser = async (state: string, ageRange: string) => {
    console.log("handleInitUser called:", { state, ageRange, lang });
    try {
      const authId = localStorage.getItem('authId') || `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('authId', authId);
      console.log("Using authId:", authId);

      const res = await fetch('/api/user/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId,
          language: lang,
          state,
          ageRange,
          consentGiven: true
        })
      });
      
      console.log("API Response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error data:", errorData);
        throw new Error(errorData.error || 'Failed to initialize user');
      }

      const data = await res.json();
      console.log("API Success data:", data);
      setUser(data);
      setMode('Dashboard');
    } catch (err) {
      console.error("Init User Error:", err);
      alert(t.errorOccurred || "An error occurred while setting up your profile. Please try again.");
    }
  };

  const submitScreening = async () => {
    if (!user) return;
    const res = await fetch('/api/screening/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.userId,
        type: screeningType,
        responses: screeningAnswers.map((v, i) => ({ q: i + 1, v }))
      })
    });
    const data = await res.json();
    setResult(data);
    setMode('Result');
  };

  const fetchProgram = async () => {
    if (!user) return;
    const nextDay = userProgress.lastDay + 1;
    if (nextDay > 21) {
      // Program finished, maybe show a special message or restart
      setMode('Dashboard');
      return;
    }
    const res = await fetch(`/api/programs/day/${nextDay}`);
    const data = await res.json();
    setProgramDay(data);
    setReflection('');
    setMode('Program');
  };

  const completeDay = async () => {
    if (!user || !programDay) return;
    const res = await fetch('/api/user/progress/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.userId, 
        dayNumber: programDay.dayNumber,
        reflectionText: reflection
      })
    });
    const data = await res.json();
    if (data.crisisTriggered) {
      setResult({
        screeningId: 'crisis-reflection',
        totalScore: 99,
        severity: Severity.CRISIS,
        crisisFlag: true
      });
      setMode('Result');
    } else {
      setMode('Dashboard');
    }
    await fetchProgress(user.userId);
  };

  const fetchNgos = async () => {
    const res = await fetch('/api/ngos');
    const data = await res.json();
    setNgos(data);
    setMode('Referral');
  };

  const fetchReflections = async () => {
    if (!user) return;
    const res = await fetch(`/api/user/${user.userId}/reflections`);
    const data = await res.json();
    setReflections(data);
    setMode('Journal');
  };

  const handleSendMessage = async () => {
    if (!user || !chatInput.trim() || isChatLoading) return;
    
    const newMessage = { role: 'user' as const, content: chatInput };
    setChatHistory(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          message: chatInput,
          history: chatHistory
        })
      });
      const data = await res.json();
      if (data.response) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const updateSettings = async (model: string) => {
    if (!user) return;
    await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, aiModel: model })
    });
    setUser({ ...user, aiModel: model });
    setMode('Dashboard');
  };

  const updateLanguage = async (newLang: Language) => {
    if (!user) return;
    setLang(newLang);
    await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, language: newLang })
    });
    setUser({ ...user, language: newLang });
    setMode('Dashboard');
  };

  const fetchAdminStats = async () => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setAdminStats(data);
    setMode('Admin');
  };

  const translateSeverity = (s: string) => {
    switch (s) {
      case 'Low': return t.low;
      case 'Moderate': return t.moderate;
      case 'High': return t.high;
      case 'Crisis': return t.crisis;
      default: return s;
    }
  };

  const renderWelcome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-stone-50"
    >
      <div className="w-24 h-24 mb-8 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm">
        <Heart size={48} fill="currentColor" />
      </div>
      <h1 className="text-4xl font-bold text-stone-900 mb-4 tracking-tight">{t.welcome}</h1>
      <p className="text-lg text-stone-600 mb-12 max-w-xs">{t.tagline}</p>
      <button 
        onClick={() => setMode('Language')}
        className="w-full max-w-xs py-4 bg-stone-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-lg"
      >
        {t.getStarted} <ChevronRight size={20} />
      </button>
    </motion.div>
  );

  const renderLanguage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen p-6 bg-stone-50"
    >
      <h2 className="text-2xl font-bold text-stone-900 mt-12 mb-8">{t.selectLang}</h2>
      <div className="grid grid-cols-1 gap-4">
        {[
          { id: Language.EN, label: 'English' },
          { id: Language.BM, label: 'Bahasa Malaysia' },
          { id: Language.ZH, label: 'Mandarin (中文)' },
          { id: Language.TA, label: 'Tamil (தமிழ்)' }
        ].map((l) => (
          <button
            key={l.id}
            onClick={() => { setLang(l.id); setMode('Onboarding'); }}
            className="p-6 bg-white border border-stone-200 rounded-2xl text-left flex items-center justify-between hover:border-emerald-500 transition-all group"
          >
            <span className="text-lg font-medium text-stone-800">{l.label}</span>
            <Globe size={20} className="text-stone-400 group-hover:text-emerald-500" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderOnboarding = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col min-h-screen p-6 bg-stone-50"
    >
      <div className="mt-12 mb-8 flex-1">
        <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 text-emerald-600">
          <Info size={32} />
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-6">{t.onboarding.title}</h2>
        
        <div className="space-y-6">
          <section>
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">{t.whatItIs}</h4>
            <p className="text-stone-600 leading-relaxed">{t.onboarding.whatIs}</p>
          </section>

          <section>
            <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">{t.whatItIsNot}</h4>
            <p className="text-stone-600 leading-relaxed">{t.onboarding.whatIsNot}</p>
          </section>

          <section className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-stone-900">
              <Shield size={18} className="text-emerald-500" />
              <h4 className="font-bold text-sm">{t.privacyNotice}</h4>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">{t.onboarding.privacy}</p>
          </section>
        </div>
      </div>

      <div className="mt-auto pb-8">
        <button 
          onClick={() => setMode('Consent')}
          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-semibold shadow-lg"
        >
          {t.next}
        </button>
      </div>
    </motion.div>
  );

  const renderConsent = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col min-h-screen p-6 bg-stone-50"
    >
      <div className="mt-12 mb-8">
        <Shield size={48} className="text-emerald-600 mb-4" />
        <h2 className="text-2xl font-bold text-stone-900 mb-4">{t.consentTitle}</h2>
        <div className="p-6 bg-white rounded-2xl border border-stone-200 text-stone-600 leading-relaxed">
          {t.consentBody}
        </div>
      </div>
      <div className="mt-auto pb-8">
        <button 
          onClick={() => setMode('Profile')}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-emerald-700 transition-colors"
        >
          {t.agree}
        </button>
      </div>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-stone-50"
    >
      <header className="p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t.hello}, {user?.state ? (t.states[user.state] || user.state) : ''}</h1>
          <p className="text-stone-500">{t.howAreYou}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode('Settings')} className="p-2 text-stone-400 hover:text-stone-900">
            <Settings size={24} />
          </button>
          <button onClick={() => setMode('Admin')} className="p-2 text-stone-400 hover:text-stone-900">
            <BarChart3 size={24} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <button 
          onClick={() => setMode('Chat')}
          className="w-full p-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl text-white text-left shadow-xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">{t.aiSupport}</h3>
            <p className="text-indigo-100 text-sm opacity-90">{t.talkToAssistant}</p>
          </div>
          <MessageCircle size={100} className="absolute -bottom-6 -right-6 text-white opacity-10 group-hover:scale-110 transition-transform" />
        </button>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">PHQ-9</h3>
              <p className="text-emerald-100 mb-6 text-sm opacity-90">{t.moodDepressionAssessment}</p>
              <button 
                onClick={() => { setScreeningType('PHQ-9'); setScreeningAnswers([]); setCurrentQ(0); setMode('Screening'); }}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors"
              >
                {t.startAssessment} <ArrowRight size={18} />
              </button>
            </div>
            <Heart size={120} className="absolute -bottom-10 -right-10 text-emerald-500 opacity-20 rotate-12" />
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">GAD-7</h3>
              <p className="text-blue-100 mb-6 text-sm opacity-90">{t.anxietyStressAssessment}</p>
              <button 
                onClick={() => { setScreeningType('GAD-7'); setScreeningAnswers([]); setCurrentQ(0); setMode('Screening'); }}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                {t.startAssessment} <ArrowRight size={18} />
              </button>
            </div>
            <Heart size={120} className="absolute -bottom-10 -right-10 text-blue-500 opacity-20 rotate-12" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={fetchProgram}
            className="p-6 bg-white rounded-3xl border border-stone-200 text-left hover:border-emerald-500 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100">
              <BookOpen size={24} />
            </div>
            <h4 className="font-bold text-stone-900">{t.programTitle}</h4>
            <p className="text-xs text-stone-500 mt-1">{userProgress.lastDay >= 21 ? t.journeyComplete : `${t.day} ${userProgress.lastDay + 1}`}</p>
          </button>
          <button 
            onClick={fetchReflections}
            className="p-6 bg-white rounded-3xl border border-stone-200 text-left hover:border-emerald-500 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-100">
              <MessageCircle size={24} />
            </div>
            <h4 className="font-bold text-stone-900">{t.journal}</h4>
            <p className="text-xs text-stone-500 mt-1">{t.yourReflections}</p>
          </button>
        </div>
        
        <button 
          onClick={fetchNgos}
          className="w-full p-6 bg-white rounded-3xl border border-stone-200 text-left hover:border-emerald-500 transition-all group flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-100">
            <Phone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900">{t.referralTitle}</h4>
            <p className="text-xs text-stone-500">{t.getProfessionalHelp}</p>
          </div>
        </button>

        <div className="p-6 bg-stone-900 rounded-3xl text-white">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">{t.streak}</h4>
            <span className="text-emerald-400 font-mono">{userProgress.streak} {t.days}</span>
          </div>
          <div className="flex gap-2">
            {[1,2,3,4,5,6,7].map(d => (
              <div key={d} className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: d <= (userProgress.streak % 8) ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );

  const renderScreening = () => {
    const questions = screeningType === 'PHQ-9' ? t.phq9 : t.gad7;
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col min-h-screen bg-stone-50 p-6"
      >
        <div className="mt-12 mb-8">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
            <span className="text-sm font-mono text-stone-400">{currentQ + 1} / {questions.length}</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h3 className="text-2xl font-bold text-stone-900 mb-8 leading-tight">
              {questions[currentQ]}
            </h3>
            <div className="space-y-3">
              {t.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newAnswers = [...screeningAnswers];
                    newAnswers[currentQ] = i;
                    setScreeningAnswers(newAnswers);
                    if (currentQ < questions.length - 1) {
                      setCurrentQ(currentQ + 1);
                    } else {
                      submitScreening();
                    }
                  }}
                  className="w-full p-6 bg-white border border-stone-200 rounded-2xl text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-stone-700"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderResult = () => {
    if (!result) return null;
    const isCrisis = result.severity === Severity.CRISIS;
    const isHigh = result.severity === Severity.HIGH;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col min-h-screen bg-stone-50 p-6"
      >
        <div className="mt-12 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${isCrisis || isHigh ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {isCrisis || isHigh ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-2">{t.assessmentResult}</h2>
          <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6 ${isCrisis || isHigh ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
            {translateSeverity(result.severity)} {t.distress}
          </div>
          
          <p className="text-stone-600 leading-relaxed mb-8 max-w-xs">
            {isCrisis ? t.crisisMsg : isHigh ? t.highMsg : result.severity === Severity.MODERATE ? t.modMsg : t.lowMsg}
          </p>

          {isCrisis || isHigh ? (
            <div className="w-full space-y-4">
              <a 
                href="tel:0376272929" 
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone size={20} /> {t.callBefrienders}
              </a>
              <button 
                onClick={fetchNgos}
                className="w-full py-4 bg-white border border-stone-200 text-stone-900 rounded-2xl font-bold"
              >
                {t.findLocalSupport}
              </button>
            </div>
          ) : (
            <button 
              onClick={fetchProgram}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg"
            >
              {t.startProgram}
            </button>
          )}
          
          <button 
            onClick={() => setMode('Dashboard')}
            className="mt-6 text-stone-400 font-medium hover:text-stone-600"
          >
            {t.backToHome}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderProgram = () => {
    if (!programDay) return null;
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col min-h-screen bg-stone-50 p-6"
      >
        <header className="mt-12 mb-8 flex items-center gap-4">
          <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
          <h2 className="text-2xl font-bold text-stone-900">{t.day} {programDay.dayNumber}</h2>
        </header>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <BookOpen size={20} />
              <h4 className="font-bold uppercase tracking-wider text-xs">{t.exercise}</h4>
            </div>
            <p className="text-stone-700 leading-relaxed">{t.programContent?.[programDay.dayNumber]?.exercise || programDay.exercise}</p>
          </div>

          {programDay.breathing !== 'N/A' && (
            <BreathingCircle t={t} />
          )}

          <div className="bg-stone-900 p-6 rounded-3xl text-white">
            <div className="flex items-center gap-3 mb-4 text-stone-400">
              <MessageCircle size={20} />
              <h4 className="font-bold uppercase tracking-wider text-xs">{t.reflection}</h4>
            </div>
            <p className="text-stone-200 italic">"{t.programContent?.[programDay.dayNumber]?.reflection || programDay.reflection}"</p>
            <textarea 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={t.reflectionPlaceholder}
              className="w-full mt-4 p-4 bg-stone-800 border-none rounded-2xl text-white focus:ring-1 focus:ring-emerald-500 outline-none min-h-[100px]"
            />
          </div>
        </div>

        <div className="mt-auto pb-8">
          <button 
            onClick={completeDay}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg"
          >
            {t.completeDay}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderReferral = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-stone-50 p-6"
    >
      <header className="mt-12 mb-8 flex items-center gap-4">
        <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-stone-900">{t.referralTitle}</h2>
      </header>

      <div className="space-y-4">
        {ngos.map(ngo => (
          <div key={ngo.ngoId} className="bg-white p-6 rounded-3xl border border-stone-200 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-stone-900">{ngo.name}</h4>
              <p className="text-xs text-stone-500">{t.states[ngo.state] || ngo.state}</p>
            </div>
            <a 
              href={ngo.contact.startsWith('0') ? `tel:${ngo.contact}` : `https://${ngo.contact}`}
              className="p-3 bg-stone-100 rounded-2xl text-stone-900 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
            >
              <Phone size={20} />
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAdmin = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-stone-50 p-6"
    >
      <header className="mt-12 mb-8 flex items-center gap-4">
        <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-stone-900">{t.stats}</h2>
      </header>

      {!adminStats ? (
        <button onClick={fetchAdminStats} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold">{t.loadStats}</button>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center">
              <span className="text-3xl font-bold text-stone-900">{adminStats.totalUsers}</span>
              <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">{t.totalUsers}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
              <span className="text-3xl font-bold text-red-600">{adminStats.crisisEvents}</span>
              <p className="text-xs text-red-400 uppercase tracking-widest mt-2">{t.crisisAlerts}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200">
            <h4 className="font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} /> {t.severityDistribution}</h4>
            <div className="space-y-4">
              {adminStats.severityStats.map((s: any) => (
                <div key={s.severity}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{translateSeverity(s.severity)}</span>
                    <span>{s.count}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${s.severity === 'Crisis' ? 'bg-red-500' : s.severity === 'High' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                      style={{ width: `${(s.count / adminStats.totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderJournal = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-stone-50 p-6"
    >
      <header className="mt-12 mb-8 flex items-center gap-4">
        <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-stone-900">{t.journal}</h2>
      </header>

      <div className="space-y-4">
        {reflections.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>{t.noReflections}</p>
          </div>
        ) : (
          reflections.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t.day} {r.dayNumber}</span>
                <span className="text-xs text-stone-400">
                  {new Date(r.completionDt).toLocaleDateString(
                    lang === Language.BM ? 'ms-MY' : 
                    lang === Language.ZH ? 'zh-CN' : 
                    lang === Language.TA ? 'ta-IN' : 'en-US'
                  )}
                </span>
              </div>
              <p className="text-stone-700 leading-relaxed italic">"{r.reflectionText}"</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-stone-50 p-6"
    >
      <header className="mt-12 mb-8 flex items-center gap-4">
        <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-stone-900">{t.settings}</h2>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Globe size={18} /> {t.languagePreference}</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: Language.EN, label: 'English' },
              { id: Language.BM, label: 'Bahasa Malaysia' },
              { id: Language.ZH, label: 'Mandarin (中文)' },
              { id: Language.TA, label: 'Tamil (தமிழ்)' }
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => updateLanguage(l.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  lang === l.id ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="font-medium">{l.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Settings size={18} /> {t.aiModelConfig}</h4>
          <p className="text-xs text-stone-500 mb-4">{t.chooseModel}</p>
          
          <div className="space-y-2">
            {[
              'openrouter/free',
              'google/gemini-2.0-flash-exp:free',
              'meta-llama/llama-3.3-70b-instruct:free',
              'mistralai/mistral-7b-instruct:free'
            ].map(m => (
              <button
                key={m}
                onClick={() => updateSettings(m)}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  user?.aiModel === m ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="font-mono text-xs">{m}</div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">{t.customModelId}</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. openai/gpt-4o"
                className="flex-1 p-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateSettings((e.target as HTMLInputElement).value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200">
          <h4 className="font-bold mb-4 flex items-center gap-2"><HelpCircle size={18} /> {t.supportInfo}</h4>
          <button 
            onClick={() => setMode('Onboarding')}
            className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl text-left text-sm text-stone-600 flex items-center justify-between hover:bg-stone-100 transition-colors"
          >
            <span>{t.revisitOnboarding}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-stone-50"
    >
      <header className="mt-12 px-6 mb-4 flex items-center gap-4">
        <button onClick={() => setMode('Dashboard')} className="text-stone-400"><ChevronLeft size={24} /></button>
        <div>
          <h2 className="text-xl font-bold text-stone-900">{t.aiSupport}</h2>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">{user?.aiModel}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">{t.chatPlaceholder}</p>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
            }`}>
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="markdown-body text-sm leading-relaxed max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 p-4 rounded-3xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-stone-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.typeMessage}
            className="flex-1 p-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isChatLoading}
            className="p-4 bg-indigo-600 text-white rounded-2xl disabled:opacity-50"
          >
            <ArrowRight size={20} />
          </button>
        </div>
        <p className="text-[10px] text-stone-400 text-center mt-4">{t.aiDisclaimer}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {mode === 'Welcome' && renderWelcome()}
        {mode === 'Language' && renderLanguage()}
        {mode === 'Onboarding' && renderOnboarding()}
        {mode === 'Consent' && renderConsent()}
        {mode === 'Profile' && <ProfileForm onNext={handleInitUser} t={t} />}
        {mode === 'Dashboard' && renderDashboard()}
        {mode === 'Screening' && renderScreening()}
        {mode === 'Result' && renderResult()}
        {mode === 'Program' && renderProgram()}
        {mode === 'Referral' && renderReferral()}
        {mode === 'Admin' && renderAdmin()}
        {mode === 'Journal' && renderJournal()}
        {mode === 'Settings' && renderSettings()}
        {mode === 'Chat' && renderChat()}
      </AnimatePresence>
    </div>
  );
}
