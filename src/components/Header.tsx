import { playTactileSound } from '../utils';
import { Eye, Brain, Activity } from 'lucide-react';

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
  onEnterImmersive: () => void;
  immersiveActive: boolean;
}

export default function Header({ onScrollToSection, onEnterImmersive, immersiveActive }: HeaderProps) {
  const handleClick = (sectionId: string) => {
    playTactileSound(880, 'sine', 0.05);
    onScrollToSection(sectionId);
  };

  if (immersiveActive) return null; // Hide in pure distraction-free immersive mode

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl rounded-full border border-white/10 bg-brand-surface/60 backdrop-blur-xl z-50 px-6 sm:px-8 h-16 flex justify-between items-center shadow-lg transition-all duration-300">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => handleClick('hero')}
      >
        <div className="w-8 h-8 rounded-full bg-brand-cyan-muted flex items-center justify-center border border-brand-cyan/20 group-hover:border-brand-cyan/50 transition-colors">
          <Brain className="w-4 h-4 text-brand-cyan" />
        </div>
        <span className="font-display font-bold text-lg tracking-wider text-white uppercase group-hover:text-brand-cyan transition-colors">
          Berd Focus
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => handleClick('why-focus')}
          className="font-display text-xs font-medium tracking-widest text-[#b9caca]/60 hover:text-brand-cyan transition-all uppercase cursor-pointer"
        >
          Philosophy
        </button>
        <button 
          onClick={() => handleClick('stats')}
          className="font-display text-xs font-medium tracking-widest text-[#b9caca]/60 hover:text-brand-cyan transition-all uppercase cursor-pointer"
        >
          Insights
        </button>
        <button 
          onClick={() => handleClick('deep-focus')}
          className="font-display text-xs font-medium tracking-widest text-[#b9caca]/60 hover:text-brand-violet transition-all uppercase font-semibold cursor-pointer"
        >
          Void Mode
        </button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playTactileSound(1046.5, 'sine', 0.1);
            onEnterImmersive();
          }}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-cyan/30 bg-brand-cyan-muted/10 text-xs font-semibold text-brand-cyan tracking-wider uppercase hover:border-brand-cyan/60 hover:bg-brand-cyan-muted/20 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,240,248,0.1)]"
        >
          <Eye className="w-3.5 h-3.5 animate-pulse" />
          <span>Enter Void</span>
        </button>
      </div>
    </header>
  );
}
