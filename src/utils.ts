import { Stats, FocusSession, UserSettings, WeeklyData } from './types';

// Web Audio API Synthesizer sounds for luxury tactile feedback
export const playTactileSound = (frequency: number = 880, type: OscillatorType = 'sine', duration: number = 0.08) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Smooth bell envelope description
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Fail silently if audio context restricted by browser autoplay policy
  }
};

// Heavenly bell sound for deep work start/completion
export const playBellSound = (isStart: boolean = true) => {
  if (isStart) {
    playTactileSound(523.25, 'sine', 0.8); // C5 crystalline tone
    setTimeout(() => playTactileSound(659.25, 'sine', 0.6), 120); // E5
    setTimeout(() => playTactileSound(783.99, 'sine', 0.5), 240); // G5
  } else {
    // Beautiful resolve chord
    playTactileSound(783.99, 'sine', 1.2); // G5
    setTimeout(() => playTactileSound(880.00, 'sine', 1.0), 100); // A5
    setTimeout(() => playTactileSound(987.77, 'sine', 0.8), 200); // B5
    setTimeout(() => playTactileSound(1046.50, 'sine', 1.5), 300); // C6
  }
};

// Storage keys
const STATS_KEY = 'berd_focus_stats_v1';
const HISTORY_KEY = 'berd_focus_sessions_v1';
const SETTINGS_KEY = 'berd_focus_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 8,
  customFocusMinutes: 25,
  customShortBreakMinutes: 5,
  isMuted: false,
};

export const getStoredSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    // Ignore Storage limits
  }
};

export const calculateStreak = (sessions: FocusSession[]): { currentStreak: number, longestStreak: number } => {
  const completedWorkSessions = sessions.filter(s => s.completed && s.mode === 'work');
  if (completedWorkSessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Unique dates formatted as local YYYY-MM-DD
  const dateStrings = Array.from(new Set(completedWorkSessions.map(s => {
    const d = new Date(s.timestamp);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })));

  // Sort descending
  dateStrings.sort((a, b) => b.localeCompare(a));

  const getLocalDateStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getLocalDateStr(0);
  const yesterdayStr = getLocalDateStr(1);

  let currentStreak = 0;
  if (dateStrings.includes(todayStr) || dateStrings.includes(yesterdayStr)) {
    const startStr = dateStrings.includes(todayStr) ? todayStr : yesterdayStr;
    const checkDate = new Date(startStr);

    while (true) {
      const yyyy = checkDate.getFullYear();
      const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
      const dd = String(checkDate.getDate()).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd}`;

      if (dateStrings.includes(formatted)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Find longest streak (sort oldest first)
  dateStrings.sort((a, b) => a.localeCompare(b));
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of dateStrings) {
    const currDate = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    prevDate = currDate;
  }
  if (tempStreak > longestStreak) longestStreak = tempStreak;

  return { currentStreak, longestStreak };
};

export const getWeeklyData = (sessions: FocusSession[]): WeeklyData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completedWorkSessions = sessions.filter(s => s.completed && s.mode === 'work');

  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
  const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weeklySessions = completedWorkSessions.filter(s => {
    const d = new Date(s.timestamp);
    return d >= monday && d <= sunday;
  });

  return days.map((dayName, idx) => {
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + idx);

    const daySessions = weeklySessions.filter(s => {
      const d = new Date(s.timestamp);
      return d.getDate() === targetDate.getDate() &&
             d.getMonth() === targetDate.getMonth() &&
             d.getFullYear() === targetDate.getFullYear();
    });

    const totalHours = daySessions.reduce((acc, s) => acc + (s.duration / 60), 0);
    return {
      day: dayName,
      hours: parseFloat(totalHours.toFixed(1)),
      sessions: daySessions.length
    };
  });
};

// Clears any old seeded/fake sessions from localStorage on first run after this change
export const clearFakeSeedData = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return;
    const sessions: FocusSession[] = JSON.parse(raw);
    // Remove any sessions that have IDs starting with 'seed-' (old fake data)
    const real = sessions.filter(s => !String(s.id).startsWith('seed-'));
    if (real.length !== sessions.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(real));
    }
  } catch (e) {
    // ignore
  }
};

export const getStoredSessions = (): FocusSession[] => {
  try {
    clearFakeSeedData();
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const getStoredStats = (): Stats => {
  try {
    const sessions = getStoredSessions();
    const completedWorkSessions = sessions.filter(s => s.completed && s.mode === 'work');
    const totalFocusMinutes = completedWorkSessions.reduce((acc, s) => acc + s.duration, 0);
    const { currentStreak, longestStreak } = calculateStreak(sessions);
    const settings = getStoredSettings();

    return {
      focusHours: parseFloat((totalFocusMinutes / 60).toFixed(1)),
      sessionsCompleted: completedWorkSessions.length,
      currentStreak,
      longestStreak,
      dailyGoal: settings.dailyGoal,
      weeklyData: getWeeklyData(sessions)
    };
  } catch (e) {
    return {
      focusHours: 0,
      sessionsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      dailyGoal: 8,
      weeklyData: []
    };
  }
};

export const saveStoredStats = (stats: Stats) => {
  try {
    const settings = getStoredSettings();
    settings.dailyGoal = stats.dailyGoal;
    saveStoredSettings(settings);
  } catch (e) {}
};

export const addStoredSession = (session: FocusSession) => {
  try {
    const sessions = getStoredSessions();
    sessions.unshift(session);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions));
  } catch (e) {
    // Ignore Storage errors
  }
};
