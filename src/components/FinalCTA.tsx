import { playTactileSound } from '../utils';
import { Target, ChevronUp, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface FinalCTAProps {
  onScrollToTop: () => void;
}

export default function FinalCTA({ onScrollToTop }: FinalCTAProps) {
  const handleClick = () => {
    playTactileSound(880, 'sine', 0.1);
    onScrollToTop();
  };

  return (
    <section 
      id="final-cta"
      className="relative py-24 sm:py-32 px-6 overflow-hidden bg-[#0c0f1b] border-t border-white/5 select-none"
    >
      {/* Background radial highlight */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-t-full bg-brand-cyan-muted/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Decorative central icon */}
        <div className="w-14 h-14 rounded-2xl bg-brand-surface-light border border-white/10 flex items-center justify-center mb-8 relative group">
          <div className="absolute -inset-1 rounded-2xl bg-brand-cyan/20 blur opacity-40 group-hover:opacity-100 transition-opacity" />
          <Target className="w-6 h-6 text-brand-cyan group-hover:scale-110 transition-transform relative z-10" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-6 max-w-2xl">
          The Void Awaits. Reclaim Your Attention.
        </h2>
        
        <p className="font-sans text-base sm:text-lg text-[#b9caca]/80 max-w-xl mx-auto mb-12 font-light leading-relaxed">
          Step into a distraction-free canopy where metrics dissipate and absolute focus emerges. Your journey to mastery is one action away.
        </p>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={handleClick}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-brand-cyan text-brand-bg font-display text-xs font-bold tracking-[0.2em] uppercase hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(0,240,248,0.3)] hover:shadow-[0_0_35px_rgba(0,240,248,0.55)] focus-glow-cyan inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-brand-bg stroke-none shrink-0" />
            <span>Start Focus Session</span>
          </button>

          <button
            onClick={handleClick}
            className="w-full sm:w-auto px-10 py-4 rounded-xl border border-white/15 hover:border-white/35 text-white font-display text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Ascend to Timer</span>
          </button>
        </div>

      </div>
    </section>
  );
}
