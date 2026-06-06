import React, { useState } from 'react';
import { useTimer } from './TimerContext';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { playTactileSound } from '../utils';

interface HeroTimerProps {
  onSessionComplete?: () => void;
  onEnterImmersive?: () => void;
}

export default function HeroTimer({ onSessionComplete, onEnterImmersive }: HeroTimerProps) {
  const {
    mode,
    state,
    secondsLeft,
    selectedMinutes,
    isMuted,
    sessionNote,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    setCustomMinutes,
    setSessionNote,
    toggleMute,
    setImmersiveActive,
  } = useTimer();

  // Mouse tilt positioning state for subtle 3D parallax effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleModeChange = (newMode: typeof mode) => {
    setTimerMode(newMode);
  };

  const handleMinutesSlider = (mins: number) => {
    setCustomMinutes(mins);
  };

  const toggleTimer = () => {
    if (state === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleReset = () => {
    resetTimer();
  };

  // Mouse move handler for premium subtle 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Scale down tilt intensity
    setTilt({
      x: x / 30,
      y: -y / 30,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circumference logic for timer radial circle
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const initialSeconds = selectedMinutes * 60;
  const progressPercent = initialSeconds > 0 ? (secondsLeft / initialSeconds) : 0;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <section 
      id="hero"
      className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden bg-gradient-to-b from-brand-bg via-[#0c0e17] to-[#090b11]"
    >
      {/* Background ambient orbs and grids */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full ambient-orb-1 opacity-45 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full ambient-orb-2 opacity-35 blur-[150px]" />
        
        {/* Crisp design-line details to mimic Apple/Linear cleanliness */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Branding Badge with dynamic micro-glow */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full border border-brand-cyan/20 bg-brand-cyan-muted/10 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
          <span className="font-display text-[10px] font-bold tracking-[0.25em] text-brand-cyan uppercase">
            Berd Focus v1.2
          </span>
        </motion.div>

        {/* Brand Main Title & Action-driven tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-4 select-none">
            Focus Deep. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">Achieve More.</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#b9caca]/90 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            An elegant, high-fidelity productivity workspace designed to eliminate cognitive noise and guide you into deep focus states.
          </p>
        </motion.div>

        {/* 3D-Tilt Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: state === 'running' ? 'none' : 'transform 0.5s ease-out'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-lg glass-card rounded-[32px] p-8 sm:p-10 mb-10 shadow-2xl relative border border-white/10"
        >
          {/* Subtle inside shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-[32px] pointer-events-none" />

          {/* Mode Tabs */}
          <div className="flex justify-between p-1 bg-black/30 rounded-xl border border-white/5 mb-8">
            <button
              onClick={() => handleModeChange('work')}
              className={`flex-1 py-2.5 rounded-lg font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                mode === 'work' ? 'bg-brand-cyan-muted/20 text-brand-cyan border border-brand-cyan/20' : 'text-[#b9caca]/60 hover:text-white'
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`flex-1 py-2.5 rounded-lg font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                mode === 'shortBreak' ? 'bg-brand-violet-muted/20 text-brand-violet border border-brand-violet/20' : 'text-[#b9caca]/60 hover:text-white'
              }`}
            >
              Break
            </button>
          </div>

          {/* Focus Timer Radial Wheel */}
          <div className="relative w-72 h-72 sm:w-[310px] sm:h-[310px] mx-auto flex items-center justify-center mb-8">
            
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 300 300">
              {/* Outer Track Ring */}
              <circle
                cx="150"
                cy="150"
                r={radius}
                className="stroke-white/5"
                strokeWidth="5"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <motion.circle
                cx="150"
                cy="150"
                r={radius}
                className={mode === 'work' ? 'stroke-brand-cyan' : 'stroke-brand-violet'}
                strokeWidth="6.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.1, ease: 'linear' }}
                style={{
                  filter: mode === 'work' 
                    ? 'drop-shadow(0 0 12px rgba(0, 240, 248, 0.45))' 
                    : 'drop-shadow(0 0 12px rgba(220, 184, 255, 0.45))'
                }}
              />
            </svg>

            {/* Inner Clock Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-light text-5xl sm:text-6.5xl text-white tracking-widest block select-none tabular-nums leading-none">
                {formatTime(secondsLeft)}
              </span>
              <span className={`font-display text-[9px] font-bold tracking-[0.35em] uppercase mt-4.5 ${
                mode === 'work' ? 'text-brand-cyan/90' : 'text-brand-violet/90'
              }`}>
                {state === 'running' ? 'Focus Active' : state === 'paused' ? 'Paused' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Core Interactive Timer Controls Row */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleMute}
              className="p-3 rounded-full border border-white/10 hover:border-white/35 text-[#b9caca] hover:text-white bg-white/5 transition-all cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform focus:outline-none hover:scale-105 active:scale-95 cursor-pointer ${
                state === 'running' 
                  ? 'bg-brand-violet text-brand-bg focus-glow-violet' 
                  : 'bg-brand-cyan text-brand-bg focus-glow-cyan'
              }`}
            >
              {state === 'running' ? (
                <Pause className="w-6 h-6 fill-brand-bg stroke-none" />
              ) : (
                <Play className="w-6 h-6 fill-brand-bg stroke-none translate-x-[2px]" />
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-full border border-white/10 hover:border-white/35 text-[#b9caca] hover:text-white bg-white/5 transition-all cursor-pointer"
              title="Reset Timer"
              disabled={state === 'idle'}
              style={{ opacity: state === 'idle' ? 0.4 : 1 }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive note-taking for active work sessions */}
          {mode === 'work' && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <input
                type="text"
                placeholder="What objective are we conquering?"
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                disabled={state === 'running'}
                className="w-full text-center bg-transparent border-0 border-b border-white/10 text-xs text-[#b9caca] placeholder-[#b9caca]/40 py-2 focus:ring-0 focus:border-brand-cyan/50 transition-colors placeholder:text-center text-center focus:outline-none"
              />
            </div>
          )}

          {/* Slider for setting custom minutes directly in Idle state */}
          {state === 'idle' && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center text-[10px] font-display font-semibold tracking-wider text-[#b9caca]/60 uppercase mb-2">
                <span>Duration Option</span>
                <span className={mode === 'work' ? 'text-brand-cyan' : 'text-brand-violet'}>
                  {selectedMinutes} Minutes
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={selectedMinutes}
                onChange={(e) => handleMinutesSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-cyan focus:outline-none"
              />
            </div>
          )}
        </motion.div>

        {/* Primary Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={toggleTimer}
            className={`px-10 py-4 font-display text-xs font-bold tracking-[0.2em] rounded-full uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer inline-flex items-center gap-3 ${
              state === 'running'
                ? 'bg-transparent border border-brand-violet/40 text-brand-violet hover:border-brand-violet/70 bg-brand-violet-muted/5'
                : 'bg-brand-cyan text-brand-bg focus-glow-cyan font-bold hover:brightness-110 shadow-[0_0_20px_rgba(0,240,248,0.35)]'
            }`}
          >
            <span>{state === 'running' ? 'Pause Active Session' : 'Start Focus Session'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick toggle link to full distraction-free modal */}
          <button
            onClick={() => {
              if (!isMuted) playTactileSound(880, 'sine', 0.1);
              setImmersiveActive(true);
              if (onEnterImmersive) onEnterImmersive();
            }}
            className="font-display text-[10px] font-semibold tracking-[0.15em] text-brand-violet hover:text-white uppercase mt-1 transition-colors hover:underline cursor-pointer"
          >
            or Enter Screen Immersive Mode
          </button>
        </motion.div>

        {/* Scroll link to narrative */}
        <div 
          className="hidden md:flex flex-col items-center gap-4 mt-16 text-[#b9caca]/40 hover:text-brand-cyan/80 cursor-pointer transition-colors"
          onClick={() => {
            const el = document.getElementById('why-focus');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="font-display text-[9px] font-bold tracking-[0.3em] uppercase">
            Scroll to Descend
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-cyan/40 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-full h-1/3 bg-brand-cyan" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
