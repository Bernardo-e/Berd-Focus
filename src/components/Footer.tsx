import { playTactileSound } from '../utils';
import { Target, Linkedin, Twitter, Github } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Footer({ onScrollToSection }: FooterProps) {
  const handleNavClick = (sectionId: string) => {
    playTactileSound(880, 'sine', 0.05);
    onScrollToSection(sectionId);
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-brand-bg pt-16 pb-12 select-none text-left">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-lg tracking-wider text-white uppercase">
                Berd Focus
              </span>
            </div>
            <p className="font-sans text-sm text-[#b9caca]/65 max-w-sm font-light leading-relaxed">
              Synthesizing physical clarity and technical elegance. Designed in accordance with standard peak performance metrics to nurture sustained, deep focus.
            </p>
          </div>

          {/* Column 2: App Navigation */}
          <div>
            <h4 className="font-display text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-4">
              Workspace
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => handleNavClick('hero')} 
                  className="font-sans text-xs text-[#b9caca]/60 hover:text-brand-cyan transition-colors"
                >
                  Focus Timer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('why-focus')} 
                  className="font-sans text-xs text-[#b9caca]/60 hover:text-brand-cyan transition-colors"
                >
                  Philosophy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('showcase')} 
                  className="font-sans text-xs text-[#b9caca]/60 hover:text-brand-cyan transition-colors"
                >
                  Showcase Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('stats')} 
                  className="font-sans text-xs text-[#b9caca]/60 hover:text-brand-cyan transition-colors"
                >
                  Velocity Stats
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Utility Links */}
          <div>
            <h4 className="font-display text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-4">
              Integrations
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="font-sans text-xs text-[#b9caca]/40">
                  Local Memory Sync
                </span>
                <span className="ml-1.5 text-[8px] bg-brand-cyan-muted/10 text-brand-cyan border border-brand-cyan/20 px-1.5 py-0.5 rounded uppercase font-medium">
                  Active
                </span>
              </li>
              <li>
                <span className="font-sans text-xs text-[#b9caca]/40">
                  Oscillator Audio synths
                </span>
              </li>
              <li>
                <span className="font-sans text-xs text-[#b9caca]/40">
                  Offline Compatibility
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer bottom details */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-[#b9caca]/40">
            © 2026 Berd Focus. Crafted with absolute premium craftsmanship. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-display text-[10px] font-bold tracking-widest text-[#b9caca]/40 uppercase">
              All Systems Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
