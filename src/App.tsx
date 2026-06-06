import { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import HeroTimer from './components/HeroTimer';
import FocusStorytelling from './components/FocusStorytelling';
import TimerShowcase from './components/TimerShowcase';
import PerformanceStats from './components/PerformanceStats';
import DeepFocusShowcase from './components/DeepFocusShowcase';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { playTactileSound } from './utils';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, X } from 'lucide-react';
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
    setCustomMinutes,
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

  const [showImmersiveControls, setShowImmersiveControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      if (!immersiveActive) return;
      setShowImmersiveControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (state === 'running') {
          setShowImmersiveControls(false);
        }
      }, 2500);
    };

    if (immersiveActive) {
      window.addEventListener('mousemove', handleMouseMove);
      controlsTimeoutRef.current = setTimeout(() => {
        if (state === 'running') {
          setShowImmersiveControls(false);
        }
      }, 2500);
    } else {
      setShowImmersiveControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [immersiveActive, state]);

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
            className="fixed inset-0 z-50 bg-[#020306] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Floating Soft Ambient Light */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
              <motion.div 
                animate={{ 
                  scale: state === 'running' ? [1, 1.15, 1] : 1, 
                  opacity: state === 'running' ? [0.12, 0.28, 0.12] : 0.2 
                }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                className={`w-[600px] h-[600px] rounded-full blur-[140px] transition-colors duration-1000 ${
                  mode === 'work' ? 'bg-brand-cyan/20' : 'bg-brand-violet/20'
                }`}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            {/* Top-Right Floating Exit Button */}
            <button
              onClick={handleExitImmersive}
              className={`fixed top-6 right-6 sm:top-8 sm:right-8 z-50 p-3 rounded-full border border-white/10 hover:border-white/30 bg-white/5 text-[#b9caca]/60 hover:text-white transition-all duration-750 cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 ${
                showImmersiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="Exit Void Mode (ESC)"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Immersive Contents */}
            <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
              
              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full mb-6 sm:mb-8 backdrop-blur-md transition-all duration-750 ${
                showImmersiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                <span className="font-display text-[9px] font-bold tracking-[0.3em] text-[#b9caca]/70 uppercase">
                  VOID CANOPY ACTIVE
                </span>
              </div>

              {/* Giant countdown timer with SVG progress circle */}
              {(() => {
                const immersiveRadius = 145;
                const immersiveCircumference = 2 * Math.PI * immersiveRadius;
                const immersiveStrokeDashoffset = immersiveCircumference - progressPercent * immersiveCircumference;
                return (
                  <div className="relative w-80 h-80 sm:w-[390px] sm:h-[390px] md:w-[430px] md:h-[430px] rounded-full flex items-center justify-center mb-6 sm:mb-8 transition-transform duration-500">
                    <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 320 320">
                      {/* Outer track */}
                      <circle
                        cx="160"
                        cy="160"
                        r={immersiveRadius}
                        className="stroke-white/5"
                        strokeWidth="3.5"
                        fill="none"
                      />
                      {/* Animated Progress */}
                      <motion.circle
                        cx="160"
                        cy="160"
                        r={immersiveRadius}
                        className={mode === 'work' ? 'stroke-brand-cyan' : 'stroke-brand-violet'}
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={immersiveCircumference}
                        strokeDashoffset={immersiveStrokeDashoffset}
                        animate={{ strokeDashoffset: immersiveStrokeDashoffset }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                        style={{
                          filter: mode === 'work' 
                            ? 'drop-shadow(0 0 14px rgba(0, 240, 248, 0.4))' 
                            : 'drop-shadow(0 0 14px rgba(220, 184, 255, 0.4))'
                        }}
                      />
                    </svg>

                    <div className="text-center z-10 px-6">
                      <h2 className="font-display font-light text-6xl sm:text-7xl md:text-8xl text-white tracking-widest leading-none timer-glow select-none tabular-nums">
                        {formatTime(secondsLeft)}
                      </h2>

                      {/* Minute editor — only when idle or paused */}
                      {state !== 'running' && (
                        <div className={`flex items-center justify-center gap-4 mt-5 transition-all duration-500 ${
                          showImmersiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}>
                          <button
                            onClick={() => {
                              const next = Math.max(1, selectedMinutes - 1);
                              setCustomMinutes(next);
                              if (!isMuted) playTactileSound(800, 'sine', 0.03);
                            }}
                            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-sm font-bold cursor-pointer flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className={`font-display text-sm font-semibold tracking-widest ${
                            mode === 'work' ? 'text-brand-cyan' : 'text-brand-violet'
                          }`}>
                            {selectedMinutes} min
                          </span>
                          <button
                            onClick={() => {
                              const next = Math.min(120, selectedMinutes + 1);
                              setCustomMinutes(next);
                              if (!isMuted) playTactileSound(900, 'sine', 0.03);
                            }}
                            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-sm font-bold cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {state === 'running' && (
                        <p className={`font-display text-[9px] tracking-[0.3em] uppercase mt-5 transition-all duration-750 ${
                          mode === 'work' ? 'text-brand-cyan/85' : 'text-brand-violet/85'
                        } ${showImmersiveControls ? 'opacity-100' : 'opacity-30'}`}>
                          {mode === 'work' ? 'FOCUSING' : 'ON BREAK'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              <p className={`font-sans text-xs sm:text-sm text-[#b9caca]/55 max-w-sm mb-6 sm:mb-8 font-light leading-relaxed transition-all duration-750 ${
                showImmersiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                Quiet your thoughts. The entire device interface is locked into single-task attention.
              </p>

              {/* Distraction-Free Controls */}
              <div className={`flex items-center gap-6 mb-6 transition-all duration-750 ${
                showImmersiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
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
                className={`font-display text-[10px] font-bold tracking-[0.2em] text-[#b9caca]/40 hover:text-brand-cyan uppercase transition-all duration-750 inline-block focus:outline-none border-b border-transparent hover:border-brand-cyan/20 pb-1 mt-2 cursor-pointer ${
                  showImmersiveControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
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
