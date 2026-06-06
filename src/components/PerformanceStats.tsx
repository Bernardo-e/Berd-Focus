import { useState } from 'react';
import { useTimer } from './TimerContext';
import { Clock, Zap, Target, BarChart2, Award, List, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playTactileSound } from '../utils';

export default function PerformanceStats() {
  const { stats, sessions, updateSettings, clearHistory, isMuted } = useTimer();
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const maxHours = stats ? Math.max(...stats.weeklyData.map(d => d.hours), 8) : 8;

  const handleBarHover = (day: string | null) => {
    if (day && day !== hoveredDay && !isMuted) {
      playTactileSound(1000, 'sine', 0.02);
    }
    setHoveredDay(day);
  };

  // Calculate today's stats
  const today = new Date().toDateString();
  const completedWorkToday = sessions.filter(
    s => s.completed && s.mode === 'work' && new Date(s.timestamp).toDateString() === today
  );
  
  const todaySessionsCount = completedWorkToday.length;
  const todayMinutes = completedWorkToday.reduce((acc, s) => acc + s.duration, 0);
  const todayHours = parseFloat((todayMinutes / 60).toFixed(1));

  // Calculate weekly stats
  const weeklyHours = stats.weeklyData.reduce((acc, d) => acc + d.hours, 0).toFixed(1);

  // Goal progress percentage
  const goalProgressPct = Math.min(100, Math.round((todaySessionsCount / stats.dailyGoal) * 100));

  const formatSessionTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    
    // Check if today
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) {
      return `Today, ${timeStr}`;
    } else if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    } else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
    }
  };

  const handleClearHistory = () => {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
      if (!isMuted) playTactileSound(300, 'sine', 0.2);
    } else {
      setConfirmClear(true);
      if (!isMuted) playTactileSound(440, 'triangle', 0.1);
      setTimeout(() => setConfirmClear(false), 3000); // Reset confirm state after 3s
    }
  };

  if (!stats) return null;

  return (
    <section 
      id="stats"
      className="relative py-24 sm:py-32 px-6 overflow-hidden bg-[#0a0d18] border-y border-white/5"
    >
      {/* Visual background details resembling a technical viewport */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-brand-cyan-muted/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Intro Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 max-w-5xl mx-auto">
          <div>
            <span className="font-display text-[10px] font-bold tracking-[0.25em] text-brand-cyan uppercase bg-brand-cyan-muted/10 px-4 py-1.5 rounded-full border border-brand-cyan/10 inline-block mb-6">
              Performance Analytics
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-4 text-left">
              Consolidate Your Progress.
            </h2>
            <p className="font-sans text-base text-[#b9caca]/85 font-light leading-relaxed max-w-2xl text-left">
              Track focused intervals, ongoing streaks, and chronological distribution metrics. Your data is stored locally and securely.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-surface-light border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="font-display text-[10px] font-bold tracking-wider uppercase text-[#b9caca]/60">
              Database Sync: Active
            </span>
          </div>
        </div>

        {/* Bento Grid of Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8 text-left">
          
          {/* Stats Box 1: Focus Hours (Cumulative and Today) */}
          <div className="glass-card rounded-[24px] p-8 hover:shadow-[0_0_50px_rgba(0,240,248,0.06)] transition-all duration-500 relative group border border-white/10 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-surface-light border border-white/5 flex items-center justify-center">
                <Clock className="w-5 h-5 text-brand-cyan" />
              </div>
              <span className="font-display text-[9px] font-bold tracking-widest text-[#b9caca]/40 uppercase">
                Focus Time
              </span>
            </div>
            <div>
              <span className="font-display font-light text-5xl sm:text-6xl text-white block tracking-widest tabular-nums font-bold">
                {stats.focusHours}h
              </span>
              <span className="font-display text-[10px] font-semibold text-brand-cyan/80 tracking-widest uppercase mt-2 block">
                Total Focus ({todayHours}h completed today)
              </span>
            </div>
          </div>

          {/* Stats Box 2: Streaks (Current and Longest) */}
          <div className="glass-card rounded-[24px] p-8 hover:shadow-[0_0_50px_rgba(220,184,255,0.06)] transition-all duration-500 relative group border border-white/10 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-surface-light border border-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-violet" />
              </div>
              <span className="font-display text-[9px] font-bold tracking-widest text-[#b9caca]/40 uppercase">
                Streaks
              </span>
            </div>
            <div>
              <span className="font-display font-light text-5xl sm:text-6xl text-white block tracking-widest tabular-nums font-bold">
                {stats.currentStreak}d
              </span>
              <span className="font-display text-[10px] font-semibold text-brand-violet/80 tracking-widest uppercase mt-2 block">
                Current Streak (Longest: {stats.longestStreak}d)
              </span>
            </div>
          </div>

          {/* Stats Box 3: Daily Goal progress & Target Calibration */}
          <div className="glass-card rounded-[24px] p-8 hover:shadow-[0_0_50px_rgba(0,240,248,0.06)] transition-all duration-500 relative group border border-white/10 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-surface-light border border-white/5 flex items-center justify-center">
                <Target className="w-5 h-5 text-brand-cyan" />
              </div>
              <span className="font-display text-[9px] font-bold tracking-widest text-[#b9caca]/40 uppercase">
                Daily Goal
              </span>
            </div>
            <div>
              <div className="flex justify-between items-end">
                <span className="font-display font-light text-4xl sm:text-5xl text-white block tracking-widest tabular-nums font-bold">
                  {todaySessionsCount}/{stats.dailyGoal}
                </span>
                {todaySessionsCount >= stats.dailyGoal ? (
                  <span className="text-[10px] text-green-400 font-display font-bold uppercase tracking-wider mb-2 animate-bounce">
                    🎉 Achieved!
                  </span>
                ) : (
                  <span className="text-[10px] text-[#b9caca]/40 font-display font-bold uppercase tracking-wider mb-2">
                    {goalProgressPct}% Complete
                  </span>
                )}
              </div>

              {/* Goal progress bar */}
              <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-500 ${
                    todaySessionsCount >= stats.dailyGoal ? 'bg-green-400' : 'bg-brand-cyan'
                  }`}
                  style={{ width: `${goalProgressPct}%` }}
                />
              </div>

              {/* Daily target editor controls */}
              <div className="flex items-center gap-1.5 mt-4 bg-black/20 border border-white/5 rounded-lg px-2 py-1 w-fit">
                <span className="text-[8px] text-[#b9caca]/50 font-display uppercase tracking-wider mr-1">Goal:</span>
                <button 
                  onClick={() => {
                    if (!isMuted) playTactileSound(800, 'sine', 0.03);
                    updateSettings({ dailyGoal: Math.max(1, stats.dailyGoal - 1) });
                  }}
                  className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[10px] text-[#dfe2f3] hover:bg-white/10 hover:text-white transition-all font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-bold text-white w-4 text-center font-display">{stats.dailyGoal}</span>
                <button 
                  onClick={() => {
                    if (!isMuted) playTactileSound(900, 'sine', 0.03);
                    updateSettings({ dailyGoal: Math.min(12, stats.dailyGoal + 1) });
                  }}
                  className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[10px] text-[#dfe2f3] hover:bg-white/10 hover:text-white transition-all font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Weekly Summary Chart Frame */}
        <div className="max-w-5xl mx-auto glass-card rounded-[24px] p-8 border border-white/10 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-brand-cyan" />
              <h3 className="font-display font-semibold text-lg text-white">Weekly Focus Velocity</h3>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-display font-semibold tracking-wider text-[#b9caca]/60 uppercase">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-brand-cyan block shadow-[0_0_10px_rgba(0,240,248,0.4)]" />
                <span>{weeklyHours} Focus Hours Completed Mon - Sun</span>
              </div>
            </div>
          </div>

          {/* Visual Canvas Representation of Chart Bars */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 relative px-2 sm:px-6">
            
            {/* Grid Line Accents */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/5" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/5" />

            {stats.weeklyData.map((data, index) => {
              const heightPct = `${(data.hours / maxHours) * 100}%`;
              const isHovered = hoveredDay === data.day;
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                  onMouseEnter={() => handleBarHover(data.day)}
                  onMouseLeave={() => handleBarHover(null)}
                >
                  {/* Tooltip Overlay */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-[calc(100%-80px)] z-20 bg-brand-surface-high border border-white/15 p-3 rounded-xl pointer-events-none text-left min-w-[130px] shadow-xl"
                      >
                        <span className="block text-[8px] font-display font-bold tracking-wider text-[#b9caca]/50 uppercase mb-1">
                          {data.day} Details
                        </span>
                        <span className="block font-display text-sm text-white font-bold mb-0.5">
                          {data.hours} Focus Hours
                        </span>
                        <span className="block text-[9px] text-brand-cyan uppercase font-display font-bold tracking-wider">
                          {data.sessions} Sprint{data.sessions !== 1 ? 's' : ''} completed
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* The bar element */}
                  <div className="w-full relative rounded-t-lg overflow-hidden transition-all duration-300" style={{ height: heightPct }}>
                    {/* Glowing highlight layer */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isHovered ? 'bg-[#00f0f8]/30' : 'bg-brand-cyan-muted/15'
                      }`} 
                    />
                    <div className="absolute inset-x-0 top-0 h-1 bg-brand-cyan focus-glow-cyan" />
                  </div>

                  {/* Day label */}
                  <span className={`text-[10px] font-display font-bold tracking-widest uppercase mt-4 block transition-colors ${
                    isHovered ? 'text-brand-cyan font-bold' : 'text-[#b9caca]/40'
                  }`}>
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session History Section */}
        <div className="max-w-5xl mx-auto glass-card rounded-[24px] p-8 border border-white/10 text-left">
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <List className="w-5 h-5 text-brand-violet" />
              <h3 className="font-display font-semibold text-lg text-white">Focus Log History</h3>
            </div>

            {sessions.length > 0 && (
              <button
                onClick={handleClearHistory}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-display font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  confirmClear
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'bg-white/5 text-[#b9caca]/40 border border-white/5 hover:border-red-500/20 hover:text-red-400'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmClear ? 'Confirm Delete?' : 'Clear Log'}</span>
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="py-12 text-center text-[#b9caca]/30 flex flex-col items-center justify-center gap-3">
              <Calendar className="w-8 h-8 opacity-40 animate-pulse" />
              <p className="font-sans text-sm font-light">Your Focus Log is empty. Seed some sessions to get started!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
              {sessions.slice(0, 8).map((session, idx) => (
                <div 
                  key={session.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 ${
                      session.mode === 'work'
                        ? 'bg-brand-cyan-muted/10 border-brand-cyan/20 text-brand-cyan'
                        : 'bg-brand-violet-muted/10 border-brand-violet/20 text-brand-violet'
                    }`}>
                      <span className="font-display font-bold text-xs">
                        {session.mode === 'work' ? 'F' : 'B'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-xs sm:text-sm text-white font-medium leading-tight truncate">
                        {session.note}
                      </p>
                      <p className="text-[10px] text-[#b9caca]/40 font-sans mt-0.5">
                        {formatSessionTime(session.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[10px] font-display font-bold text-[#b9caca]/40 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                      {session.duration} min
                    </span>
                    <span className={`text-[9px] font-display font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                      session.completed 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      Completed
                    </span>
                  </div>
                </div>
              ))}
              {sessions.length > 8 && (
                <p className="text-center text-[10px] text-[#b9caca]/35 italic pt-2">
                  Showing the latest 8 sessions in history
                </p>
              )}
            </div>
          )}
        </div>

        {/* Motivational Insight card */}
        <div className="max-w-5xl mx-auto bg-brand-cyan-muted/5 border border-brand-cyan/25 mt-10 rounded-2xl p-6 flex items-start gap-4 text-left">
          <Award className="w-6 h-6 text-brand-cyan shrink-0 animate-pulse mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase mb-1">
              Deep work insight of the week
            </h4>
            <p className="font-sans text-xs text-[#b9caca]/80 leading-relaxed font-light">
              Your focus cycles are stable and persisting. Aim to hit your daily goal of {stats.dailyGoal} focus sprints. Research indicates that maintaining a streak of at least 5 consecutive days of deliberate practice builds strong cognitive consolidation and neuroplasticity. Keep going!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
