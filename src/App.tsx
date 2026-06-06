import { useEffect } from 'react';
import Header from './components/Header';
import HeroTimer from './components/HeroTimer';
import FocusStorytelling from './components/FocusStorytelling';
import TimerShowcase from './components/TimerShowcase';
import PerformanceStats from './components/PerformanceStats';
import DeepFocusShowcase from './components/DeepFocusShowcase';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { playTactileSound } from './utils';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimerProvider, useTimer } from './components/TimerContext';

function AppContent() {
  const {
    immersiveActive,
    setImmersiveActive,
    secondsLeft,
    selectedMinutes,
    state,
    isMuted,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleMute,
    mode,
    sessionNote,
  } = useTimer();

  // Keyboard shortcut support: Esc to exit immersive mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && immersiveActive) {
        setImmersiveActive(false);
        if (!isMuted) {
          playTactileSound(440, 'triangle', 0.15);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [immersiveActive, isMuted, setImmersiveActive]);

  // Fullscreen API Integration
  useEffect(() => {
    if (immersiveActive) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request rejected:", err);
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.warn("Fullscreen exit rejected:", err);
        });
      }
    }
  }, [immersiveActive]);

  // Monitor native fullscreen exit (e.g. Esc key pressed natively)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && immersiveActive) {
        setImmersiveActive(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [immersiveActive, setImmersiveActive]);

  const handleEnterImmersive = () => {
    setImmersiveActive(true);
    startTimer();
  };

  const handleExitImmersive = () => {
    if (!isMuted) {
      playTactileSound(440, 'triangle', 0.15);
    }
    pauseTimer();
    setImmersiveActive(false);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circumference logic for immersive radial wheel
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const initialSeconds = selectedMinutes * 60;
  const progressPercent = initialSeconds > 0 ? (secondsLeft / initialSeconds) : 0;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="relative min-h-screen bg-brand-bg text-[#dfe2f3] select-none selection:bg-brand-cyan/20 selection:text-brand-cyan overflow-x-hidden md:no-scrollbar">
      
      {/* 1. SaaS Interactive Landing Framework */}
      <AnimatePresence mode="wait">
        {!immersiveActive ? (
          <motion.div
            key="saas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Elegant Header Navbar */}
            <Header 
              onScrollToSection={handleScrollToSection}
              onEnterImmersive={handleEnterImmersive}
              immersiveActive={immersiveActive}
            />

            {/* Section 1: Hero Section */}
            <HeroTimer 
              onEnterImmersive={handleEnterImmersive}
            />


            {/* Section 2: Why Focus Storytelling */}
            <FocusStorytelling />

            {/* Section 3: Beautiful Timer Showcase */}
            <TimerShowcase />

            {/* Section 4: Performance Analytics & Weekly Sparkline */}
            <PerformanceStats />

            {/* Section 5: Distraction-Free Canopy Preview Showcase */}
            <DeepFocusShowcase 
              onEnterImmersive={handleEnterImmersive}
            />

            {/* Section 6: Final Conversion CTA */}
            <FinalCTA 
              onScrollToTop={() => handleScrollToSection('hero')}
            />

            {/* Corporate/Creative Brand Footer */}
            <Footer 
              onScrollToSection={handleScrollToSection}
            />
          </motion.div>
        ) : (
          /* 2. Fullscreen Distraction-Free Canopy (Immersive Mode) */
          <motion.div
            key="immersive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-[#030407] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Floating Soft Ambient Light */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
              <motion.div 
                animate={{ 
                  scale: state === 'running' ? [1, 1.18, 1] : 1, 
                  opacity: state === 'running' ? [0.15, 0.35, 0.15] : 0.25 
                }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="w-[500px] h-[500px] rounded-full bg-brand-cyan/20 blur-[130px]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            {/* Immersive Contents */}
            <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full mb-10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                <span className="font-display text-[9px] font-bold tracking-[0.3em] text-[#b9caca]/70 uppercase">
                  VOID CANOPY ACTIVE
                </span>
              </div>

              {/* Giant countdown timer with SVG progress circle */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[400px] md:h-[400px] rounded-full flex items-center justify-center mb-12">
                <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 300 300">
                  {/* Outer track */}
                  <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    className="stroke-white/5"
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Animated Progress */}
                  <motion.circle
                    cx="150"
                    cy="150"
                    r={radius}
                    className={mode === 'work' ? 'stroke-brand-cyan' : 'stroke-brand-violet'}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    style={{
                      filter: mode === 'work' 
                        ? 'drop-shadow(0 0 12px rgba(0, 240, 248, 0.35))' 
                        : 'drop-shadow(0 0 12px rgba(220, 184, 255, 0.35))'
                    }}
                  />
                </svg>

                <div className="text-center z-10 px-6">
                  <h2 className="font-display font-light text-6xl sm:text-7xl md:text-8xl text-white tracking-widest leading-none timer-glow select-none tabular-nums">
                    {formatTime(secondsLeft)}
                  </h2>
                  <p className={`font-display text-[9px] tracking-[0.25em] uppercase mt-4 ${
                    mode === 'work' ? 'text-brand-cyan/70' : 'text-brand-violet/70'
                  }`}>
                    {state === 'running' ? 'CONQUERING THE OBJECTIVE' : 'CANOPY PAUSED'}
                  </p>
                  {mode === 'work' && sessionNote && (
                    <p className="font-sans text-[10px] text-[#b9caca]/40 truncate max-w-[220px] sm:max-w-[280px] mt-2 italic">
                      "{sessionNote}"
                    </p>
                  )}
                </div>
              </div>

              <p className="font-sans text-sm sm:text-base text-[#b9caca]/60 max-w-sm mb-12 font-light leading-relaxed">
                Quiet your thoughts. The entire device interface is locked into single-task attention.
              </p>

              {/* Distraction-Free Controls */}
              <div className="flex items-center gap-6 mb-8">
                {/* Toggle Mute */}
                <button
                  onClick={toggleMute}
                  className="p-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-[#b9caca]/60 hover:text-white transition-all cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    if (state === 'running') {
                      pauseTimer();
                    } else {
                      startTimer();
                    }
                  }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer ${
                    state === 'running' ? 'bg-brand-violet text-brand-bg focus-glow-violet' : 'bg-brand-cyan text-brand-bg focus-glow-cyan'
                  }`}
                >
                  {state === 'running' ? <Pause className="w-6 h-6 fill-none stroke-current" /> : <Play className="w-6 h-6 fill-brand-bg stroke-none translate-x-[2px]" />}
                </button>

                <button
                  onClick={resetTimer}
                  className="p-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-[#b9caca]/60 hover:text-white transition-all cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Exit Canopy */}
              <button
                onClick={handleExitImmersive}
                className="font-display text-[10px] font-bold tracking-[0.2em] text-[#b9caca]/40 hover:text-brand-cyan uppercase transition-colors inline-block focus:outline-none border-b border-transparent hover:border-brand-cyan/20 pb-1 mt-4 cursor-pointer"
              >
                Exit Void (ESC)
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}
