import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { TimerMode, SessionState, FocusSession, Stats, UserSettings } from '../types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredSessions,
  getStoredStats,
  addStoredSession,
  playTactileSound,
  playBellSound
} from '../utils';

interface TimerContextType {
  mode: TimerMode;
  state: SessionState;
  secondsLeft: number;
  selectedMinutes: number;
  isMuted: boolean;
  sessionNote: string;
  stats: Stats;
  sessions: FocusSession[];
  immersiveActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setCustomMinutes: (mins: number) => void;
  setSessionNote: (note: string) => void;
  toggleMute: () => void;
  setImmersiveActive: (active: boolean) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  clearHistory: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
  // Load initial settings
  const settings = getStoredSettings();

  const [mode, setMode] = useState<TimerMode>('work');
  const [state, setState] = useState<SessionState>('idle');
  const [selectedMinutes, setSelectedMinutes] = useState(settings.customFocusMinutes);
  const [secondsLeft, setSecondsLeft] = useState(settings.customFocusMinutes * 60);
  const [isMuted, setIsMuted] = useState(settings.isMuted);
  const [sessionNote, setSessionNote] = useState('');
  const [immersiveActive, setImmersiveActive] = useState(false);

  // Stats and history states (reactive)
  const [stats, setStats] = useState<Stats>(getStoredStats());
  const [sessions, setSessions] = useState<FocusSession[]>(getStoredSessions());

  // Refs for accurate timing loop
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startSecondsLeftRef = useRef<number>(0);

  // Sync mode default durations when settings or mode change
  useEffect(() => {
    if (state !== 'idle') return;
    const settings = getStoredSettings();
    let mins = settings.customFocusMinutes;
    if (mode === 'shortBreak') mins = settings.customShortBreakMinutes;

    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  }, [mode, state]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSessionComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState('idle');

    if (!isMuted) {
      playBellSound(false);
    }

    // Save completed session
    const currentDuration = selectedMinutes;
    const newSession: FocusSession = {
      id: Math.random().toString(36).substring(2, 9),
      duration: currentDuration,
      timestamp: new Date().toISOString(),
      note: mode === 'work' ? (sessionNote || 'Deep Focus Session') : 'Recuperation Break',
      mode: mode,
      completed: true,
    };

    addStoredSession(newSession);

    // Reload reactive history and stats
    const updatedSessions = getStoredSessions();
    setSessions(updatedSessions);
    setStats(getStoredStats());

    // Auto-transition to next logical mode
    let nextMode: TimerMode = 'work';
    if (mode === 'work') {
      nextMode = 'shortBreak';
    } else {
      nextMode = 'work';
    }

    setMode(nextMode);
    setSessionNote('');

    const activeSettings = getStoredSettings();
    let nextMins = activeSettings.customFocusMinutes;
    if (nextMode === 'shortBreak') nextMins = activeSettings.customShortBreakMinutes;

    setSelectedMinutes(nextMins);
    setSecondsLeft(nextMins * 60);
  };

  const startTimer = () => {
    if (state === 'running') return;

    if (!isMuted) {
      playBellSound(true);
    }

    setState('running');
    startTimeRef.current = Date.now();
    startSecondsLeftRef.current = secondsLeft;

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;
      const elapsedMs = Date.now() - startTimeRef.current;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const remaining = Math.max(0, startSecondsLeftRef.current - elapsedSeconds);

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        handleSessionComplete();
      }
    }, 100);
  };

  const pauseTimer = () => {
    if (state !== 'running') return;
    if (!isMuted) {
      playTactileSound(440, 'triangle', 0.1);
    }
    setState('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    if (!isMuted) {
      playTactileSound(300, 'sine', 0.15);
    }
    setState('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSecondsLeft(selectedMinutes * 60);
  };

  const setTimerMode = (newMode: TimerMode) => {
    if (!isMuted) {
      playTactileSound(600, 'sine', 0.05);
    }
    setMode(newMode);
    setState('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const activeSettings = getStoredSettings();
    let mins = activeSettings.customFocusMinutes;
    if (newMode === 'shortBreak') mins = activeSettings.customShortBreakMinutes;

    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const setCustomMinutes = (mins: number) => {
    if (state !== 'idle') return;
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);

    // Save custom default for this mode
    const activeSettings = getStoredSettings();
    if (mode === 'work') activeSettings.customFocusMinutes = mins;
    if (mode === 'shortBreak') activeSettings.customShortBreakMinutes = mins;
    saveStoredSettings(activeSettings);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const activeSettings = getStoredSettings();
    activeSettings.isMuted = nextMuted;
    saveStoredSettings(activeSettings);

    if (!nextMuted) {
      playTactileSound(880, 'sine', 0.05);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const activeSettings = { ...getStoredSettings(), ...newSettings };
    saveStoredSettings(activeSettings);
    
    // Apply immediately to state
    setIsMuted(activeSettings.isMuted);
    
    if (state === 'idle') {
      let mins = activeSettings.customFocusMinutes;
      if (mode === 'shortBreak') mins = activeSettings.customShortBreakMinutes;
      
      setSelectedMinutes(mins);
      setSecondsLeft(mins * 60);
    }
    
    // Refresh stats (which includes dailyGoal)
    setStats(getStoredStats());
  };

  const clearHistory = () => {
    localStorage.removeItem('berd_focus_sessions_v1');
    setSessions([]);
    setStats(getStoredStats());
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        state,
        secondsLeft,
        selectedMinutes,
        isMuted,
        sessionNote,
        stats,
        sessions,
        immersiveActive,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimerMode,
        setCustomMinutes,
        setSessionNote,
        toggleMute,
        setImmersiveActive,
        updateSettings,
        clearHistory,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
