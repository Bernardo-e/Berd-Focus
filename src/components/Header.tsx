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
          className="font-display text-xs font-medium tracking-widest text-[#b9caca] hover:text-brand-cyan transition-all uppercase"
        >
          Why Focus
        </button>
        <button 
          onClick={() => handleClick('showcase')}
          className="font-display text-xs font-medium tracking-widest text-[#b9caca] hover:text-brand-cyan transition-all uppercase"
        >
          Showcase
        </button>
        <button 
          onClick={() => handleClick('stats')}
          className="font-display text-xs font-medium tracking-widest text-[#b9caca] hover:text-brand-cyan transition-all uppercase"
        >
          Insights
        </button>
        <button 
          onClick={() => handleClick('deep-focus')}
          className="font-display text-xs font-medium tracking-widest text-[#b9caca] hover:text-brand-cyan transition-all uppercase text-brand-violet font-semibold"
        >
          Deep Mode
        </button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playTactileSound(1046.5, 'sine', 0.1);
            onEnterImmersive();
          }}
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-violet/20 bg-brand-violet-muted/20 text-xs font-medium text-brand-violet tracking-wider uppercase hover:border-brand-violet/50 hover:bg-brand-violet-muted/40 transition-all duration-300"
        >
          <Eye className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Immerse</span>
        </button>

        <button 
          onClick={() => handleClick('hero')}
          className="hidden sm:flex items-center gap-2 bg-brand-cyan-muted/10 border border-brand-cyan/20 hover:border-brand-cyan/50 hover:bg-brand-cyan-muted/20 text-xs font-semibold tracking-wider text-brand-cyan px-4 py-2 rounded-full transition-all uppercase"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Timer</span>
        </button>
      </div>
    </header>
  );
}
