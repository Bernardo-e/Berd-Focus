import { useState } from 'react';
import { playTactileSound } from '../utils';
import { Coffee, Target, Zap, ChevronRight, Activity, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ShowcaseTab = 'pomodoro' | 'breaks' | 'goals';

export default function TimerShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('pomodoro');

  const handleTabChange = (tab: ShowcaseTab) => {
    playTactileSound(880, 'sine', 0.05);
    setActiveTab(tab);
  };

  return (
    <section 
      id="showcase"
      className="relative py-24 sm:py-32 px-6 overflow-hidden bg-brand-bg select-none"
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="font-display text-[10px] font-bold tracking-[0.25em] text-brand-cyan uppercase bg-brand-cyan-muted/10 px-4 py-1.5 rounded-full border border-brand-cyan/10 inline-block mb-6">
            The Interface
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-6">
            The Flow Cycle, Deconstructed.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#b9caca]/80 font-light leading-relaxed">
            Configure, execute, and monitor your deep work intervals within a unified visual environment optimized for cognitive ease.
          </p>
        </div>

        {/* Tab selector menu */}
        <div className="flex justify-center gap-2 sm:gap-4 max-w-md mx-auto mb-12 p-1.5 bg-black/40 rounded-full border border-white/5">
          <button
            onClick={() => handleTabChange('pomodoro')}
            className={`flex-1 py-3 px-2 sm:px-4 rounded-full font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
              activeTab === 'pomodoro' 
                ? 'bg-brand-cyan text-brand-bg font-bold shadow-lg shadow-brand-cyan/20' 
                : 'text-[#b9caca]/60 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Pomodoro</span>
          </button>
          
          <button
            onClick={() => handleTabChange('breaks')}
            className={`flex-1 py-3 px-2 sm:px-4 rounded-full font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
              activeTab === 'breaks' 
                ? 'bg-brand-violet text-brand-bg font-bold shadow-lg shadow-brand-violet/20' 
                : 'text-[#b9caca]/60 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Breaks</span>
          </button>

          <button
            onClick={() => handleTabChange('goals')}
            className={`flex-1 py-3 px-2 sm:px-4 rounded-full font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
              activeTab === 'goals' 
                ? 'bg-white text-brand-bg font-bold' 
                : 'text-[#b9caca]/60 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Goals</span>
          </button>
        </div>

        {/* Interactive Showcase Interactive Container */}
        <div className="max-w-5xl mx-auto glass-card rounded-[32px] p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-cyan-muted/5 blur-3xl" />
          
          <AnimatePresence mode="wait">
            {activeTab === 'pomodoro' && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
                {/* Left Visual Interactive Column */}
                <div className="flex flex-col items-center bg-black/40 rounded-2xl p-8 border border-white/5 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-cyan/20 bg-brand-cyan-muted/15 text-[10px] text-brand-cyan tracking-wider font-display uppercase font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                    <span>Focusing Active</span>
                  </div>

                  <div className="w-48 h-48 rounded-full border border-brand-cyan/10 flex flex-col items-center justify-center relative mb-6">
                    <div className="absolute -inset-1 rounded-full border border-brand-cyan/30 animate-pulse border-dashed" />
                    <span className="font-display font-light text-4xl text-white select-none">24:59</span>
                    <span className="font-display text-[8px] tracking-widest text-[#b9caca]/60 uppercase mt-1">Conquering task</span>
                  </div>

                  <div className="text-center">
                    <h4 className="font-display font-medium text-lg text-white mb-2">Deep Focus Environment</h4>
                    <p className="font-sans text-xs text-[#b9caca]/60 max-w-xs mx-auto leading-relaxed">
                      Custom white noise integrates to slow down rapid task-switching and decrease alpha wave noise.
                    </p>
                  </div>
                </div>

                {/* Right Interactive Information Column */}
                <div className="space-y-6">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">The Pomodoro Principle</h3>
                  <p className="font-sans text-sm sm:text-base text-[#b9caca]/80 leading-relaxed font-light">
                    Focus is a limited resource that operates on cyclical waves of optimization. By engaging in dedicated 25-minute sprints of absolute single-task prioritization, we train the prefrontal cortex to sink into deep states of attention.
                  </p>
                  
                  <div className="h-px bg-white/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-surface-light p-4 rounded-xl border border-white/5">
                      <span className="font-display text-[9px] font-bold text-brand-cyan tracking-widest uppercase mb-1 block">Work Time</span>
                      <span className="font-display text-lg text-white block">25 Minutes</span>
                    </div>
                    <div className="bg-brand-surface-light p-4 rounded-xl border border-white/5">
                      <span className="font-display text-[9px] font-bold text-[#b9caca]/40 tracking-widest uppercase mb-1 block">Task Mode</span>
                      <span className="font-display text-lg text-white block">Distraction-Free</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'breaks' && (
              <motion.div
                key="breaks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
                {/* Left Visual Interactive Column */}
                <div className="flex flex-col items-center bg-black/40 rounded-2xl p-8 border border-white/5 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-violet/20 bg-brand-violet-muted/15 text-[10px] text-brand-violet tracking-wider font-display uppercase font-semibold">
                    <Moon className="w-3 h-3 text-brand-violet animate-pulse" />
                    <span>Recuperating</span>
                  </div>

                  <div className="w-48 h-48 rounded-full border border-brand-violet/10 flex flex-col items-center justify-center relative mb-6">
                    <div className="absolute -inset-1 rounded-full border border-brand-violet/30 animate-pulse" />
                    <span className="font-display font-light text-4xl text-white select-none">05:00</span>
                    <span className="font-display text-[8px] tracking-widest text-[#b9caca]/60 uppercase mt-1">Break active</span>
                  </div>

                  <div className="text-center">
                    <h4 className="font-display font-medium text-lg text-white mb-2">Restful State Synthesis</h4>
                    <p className="font-sans text-xs text-[#b9caca]/60 max-w-xs mx-auto leading-relaxed">
                      Allow your synaptic channels to downscale, restoring neural energy required for successive output.
                    </p>
                  </div>
                </div>

                {/* Right Interactive Information Column */}
                <div className="space-y-6">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">Dynamic Rest Intervals</h3>
                  <p className="font-sans text-sm sm:text-base text-[#b9caca]/80 leading-relaxed font-light">
                    The cognitive recovery phase is equally complex to focus. Berd Focus structures 5-minute scheduled transitions, guiding you to close eyes, stretch, and disconnect, allowing synaptic consolidation before descending back to work.
                  </p>
                  
                  <div className="h-px bg-white/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-surface-light p-4 rounded-xl border border-white/5 col-span-2">
                      <span className="font-display text-[9px] font-bold text-brand-violet tracking-widest uppercase mb-1 block">Scheduled Break</span>
                      <span className="font-display text-lg text-white block">5 Minutes</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              >
                {/* Left Visual Interactive Column */}
                <div className="flex flex-col items-center bg-black/40 rounded-2xl p-8 border border-white/5 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] text-[#b9caca] tracking-wider font-display uppercase font-semibold">
                    <Sun className="w-3 h-3 text-brand-cyan animate-spin" />
                    <span>Daily Progress</span>
                  </div>

                  <div className="w-48 h-48 rounded-full border border-white/10 flex flex-col items-center justify-center relative mb-6">
                    <span className="font-display font-light text-5xl text-white select-none">4 / 8</span>
                    <span className="font-display text-[8px] tracking-widest text-[#b9caca]/60 uppercase mt-1">Focus Sessions</span>
                  </div>

                  {/* Interactive session indicators bar graph simulation */}
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-2 rounded bg-brand-cyan focus-glow-cyan" />
                    <div className="w-4 h-2 rounded bg-brand-cyan focus-glow-cyan" />
                    <div className="w-4 h-2 rounded bg-brand-cyan focus-glow-cyan" />
                    <div className="w-4 h-2 rounded bg-brand-cyan focus-glow-cyan" />
                    <div className="w-4 h-2 rounded bg-white/10" />
                    <div className="w-4 h-2 rounded bg-white/10" />
                    <div className="w-4 h-2 rounded bg-white/10" />
                    <div className="w-4 h-2 rounded bg-white/10" />
                  </div>
                </div>

                {/* Right Interactive Information Column */}
                <div className="space-y-6">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">Daily Target Calibration</h3>
                  <p className="font-sans text-sm sm:text-base text-[#b9caca]/80 leading-relaxed font-light">
                    Set a healthy daily cadence. Mastering productivity requires rhythm, not overload. Align with standard peak metrics (aiming for 4 to 8 focus sessions daily) to guarantee sustained momentum without cognitive decline.
                  </p>
                  
                  <div className="h-px bg-white/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-surface-light p-4 rounded-xl border border-white/5">
                      <span className="font-display text-[9px] font-bold text-white tracking-widest uppercase mb-1 block">Goal Target</span>
                      <span className="font-display text-lg text-white block">8 Sprints</span>
                    </div>
                    <div className="bg-brand-surface-light p-4 rounded-xl border border-white/5">
                      <span className="font-display text-[9px] font-bold text-brand-cyan tracking-widest uppercase mb-1 block">Efficiency</span>
                      <span className="font-display text-lg text-white block">Compounding</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
