import { Shield, Brain, Activity, Target } from 'lucide-react';
import { motion } from 'motion/react';

const narrativeSteps = [
  {
    icon: Shield,
    title: 'Isolation Shield',
    description: 'Berd Focus establishes a digital sound barrier designed to suppress chaotic desktop noise and peripheral notification triggers.',
    color: 'text-brand-cyan',
  },
  {
    icon: Brain,
    title: 'Flow Pacing',
    description: 'By aligning session blocks with natural focus cycles, our platform reduces fatigue and facilitates continuous depth of thought.',
    color: 'text-brand-violet',
  },
  {
    icon: Target,
    title: 'Precision Action',
    description: 'A single, high-fidelity focus indicator anchors your screen, transforming complex objectives into single-task objectives.',
    color: 'text-brand-cyan',
  },
];

export default function FocusStorytelling() {
  return (
    <section 
      id="why-focus"
      className="relative py-24 sm:py-32 px-6 overflow-hidden bg-[#0a0d18] border-y border-white/5"
    >
      {/* Background visual detail */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-cyan-muted/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Narrative Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <span className="font-display text-[10px] font-bold tracking-[0.25em] text-brand-violet uppercase bg-brand-violet-muted/10 px-4 py-1.5 rounded-full border border-brand-violet/10 inline-block mb-6">
            The Philosophy
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-6">
            Designed for Deep Cognition.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#b9caca]/80 leading-relaxed font-light">
            In an era of endless feeds and fragmented attention, structural simplicity is the ultimate superpower. True productivity does not require complex dashboards. It requires pure, clean attention.
          </p>
        </div>

        {/* Narrative Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {narrativeSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="glass-card rounded-[24px] p-8 hover:bg-brand-surface-high/30 transition-all duration-300 group border border-white/10"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-surface-light flex items-center justify-center border border-white/5 mb-6 group-hover:border-brand-cyan/20 transition-all">
                  <Icon className={`w-5 h-5 ${step.color} group-hover:scale-110 transition-transform`} />
                </div>
                
                <span className="font-display text-[9px] font-bold tracking-widest text-[#b9caca]/40 uppercase mb-2 block">
                  Phase 0{idx + 1}
                </span>
                
                <h3 className="font-display font-bold text-xl text-white mb-3 tracking-wide">
                  {step.title}
                </h3>
                
                <p className="font-sans text-sm text-[#b9caca]/75 leading-relaxed font-light">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
