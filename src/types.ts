export type TimerMode = 'work' | 'shortBreak';

export type SessionState = 'idle' | 'running' | 'paused';

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  timestamp: string;
  note?: string;
  mode: TimerMode;
  completed: boolean;
}

export interface WeeklyData {
  day: string;
  hours: number;
  sessions: number;
}

export interface Stats {
  focusHours: number;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  weeklyData: WeeklyData[];
}

export interface UserSettings {
  dailyGoal: number; // target completed focus sessions per day
  customFocusMinutes: number;
  customShortBreakMinutes: number;
  isMuted: boolean;
}

export interface AIFocusBlock {
  name: string;
  duration: number;
  objective: string;
}

export interface AIFocusPlan {
  taskBreakdown: string[];
  focusBlocks: AIFocusBlock[];
  estimatedDuration: number;
  summary: string;
}
