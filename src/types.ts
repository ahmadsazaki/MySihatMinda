export enum Language {
  EN = 'en',
  BM = 'bm',
  ZH = 'zh',
  TA = 'ta'
}

export enum Severity {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  CRISIS = 'Crisis'
}

export interface User {
  userId: string;
  authId: string;
  language: Language;
  state: string;
  ageRange: string;
  consentGiven: boolean;
  aiModel: string;
  createdAt: string;
}

export interface ScreeningResult {
  screeningId: string;
  totalScore: number;
  severity: Severity;
  crisisFlag: boolean;
}

export interface MicroProgram {
  programId: number;
  dayNumber: number;
  exercise: string;
  reflection: string;
  breathing: string;
}

export interface NGO {
  ngoId: string;
  name: string;
  state: string;
  contact: string;
}
