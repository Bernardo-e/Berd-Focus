import { playTactileSound } from '../utils';
import { Eye, ShieldX, VolumeX, Sparkles, AlertCircle, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DeepFocusShowcaseProps {
  onEnterImmersive: () => void;
}

export default function DeepFocusShowcase({ onEnterImmersive }: DeepFocusShowcaseProps) {
  return (
    <section 
      id="deep-focus"
      className="relative py-24 sm:py-32 px-6 overflow-hidden bg-brand-bg select-none"
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="font-display text-[10px] font-bold tracking-[0.25em] text-brand-violet uppercase bg-brand-violet-muted/10 px-4 py-1.5 rounded-full border border-brand-violet/10 inline-block mb-6">
            Distraction Shield
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-6">
            The Distraction-Free Canopy.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#b9caca]/80 leading-relaxed font-light">
            When you enter the Void, all indicators melt away. Your screen is transformed into a peaceful, breathing space.
          </p>
        </div>

        {/* Visual Mock Showcase (Beautiful glass workspace block with breathing center element) */}
        <div className="max-w-5xl mx-auto relative group overflow-hidden rounded-[32px] border border-white/5 bg-[#07090f] shadow-2xl p-6 sm:p-14 mb-12">
          
          {/* Top layout details mimicking system controls */}
          <div className="absolute top-6 left-8 right-8 flex justify-between items-center opacity-40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            </div>
            <span className="font-display text-[9px] font-bold tracking-widest text-[#b9caca] uppercase">
              Chamber of Clarity
            </span>
            <span className="material-symbols-outlined text-[14px]">lock</span>
          </div>

          <div className="py-12 sm:py-16 flex flex-col items-center justify-center">
            
            {/* The Central Breathing Ring */}
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              
              {/* Dynamic slow breathing ring scale helper - infinite animation */}
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.4, 0.15] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-brand-cyan/20 blur-xl"
              />
              
              <div className="absolute inset-0 rounded-full border border-brand-cyan/20" />
              
              <div className="text-center z-10">
                <span className="font-display font-light text-5xl sm:text-6xl text-brand-cyan timer-glow select-none tracking-widest block font-medium">
                  25:00
                </span>
                <span className="font-display text-[8px] tracking-[0.3em] text-[#b9caca]/50 uppercase mt-2 block">
                  FLOW STATE
                </span>
              </div>
            </div>

            <p className="font-display text-sm sm:text-lg text-[#b9caca]/70 max-w-sm text-center mb-10 leading-relaxed font-light">
              Pressing the canopy activates total exclusion of secondary files, widgets, and status counters.
            </p>

            {/* Launch Action */}
            <button
              onClick={() => {
                playTactileSound(1046.50, 'sine', 0.1);
                onEnterImmersive();
              }}
              className="px-8 py-3.5 rounded-full bg-brand-violet text-brand-bg font-display text-xs font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all duration-300 focus-glow-violet inline-flex items-center gap-3 shadow-[0_0_20px_rgba(220,184,255,0.35)]"
            >
              <Maximize2 className="w-4 h-4 fill-brand-bg stroke-none shrink-0" />
              <span>Enter Immersive Mode</span>
            </button>
          </div>

          {/* Bottom details mimicking deep indicators */}
          <div className="absolute bottom-6 left-8 right-8 flex justify-center gap-6 opacity-30">
            <span className="text-[10px] font-display font-bold tracking-widest uppercase">Muted Ambient</span>
            <span className="text-[10px] font-display font-bold tracking-widest uppercase">•</span>
            <span className="text-[10px] font-display font-bold tracking-widest uppercase">Shield Engaged</span>
          </div>

        </div>

        {/* Benefits Breakdown List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-6 text-left">
          <div className="p-2">
            <h4 className="font-display font-bold text-base text-white mb-2">
              01/ Zen Typography
            </h4>
            <p className="font-sans text-xs text-[#b9caca]/70 leading-relaxed font-light">
              Interface metadata scales down, with focal numbers styled in comfortable sizes to release optic strain during sustained intervals.
            </p>
          </div>
          
          <div className="p-2">
            <h4 className="font-display font-bold text-base text-white mb-2">
              02/ Breathing Rhythm
            </h4>
            <p className="font-sans text-xs text-[#b9caca]/70 leading-relaxed font-light">
              An ambient low-contrast glow pulses dynamically in the background, subtly guiding diaphragmatic loops to reduce heart variance.
            </p>
          </div>

          <div className="p-2">
            <h4 className="font-display font-bold text-base text-white mb-2">
              03/ Total Focus Escapism
            </h4>
            <p className="font-sans text-xs text-[#b9caca]/70 leading-relaxed font-light">
              Enter a mental sanctuary. The visual canopy completely hides scroll highlights, statistics blocks, and external clutter.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
