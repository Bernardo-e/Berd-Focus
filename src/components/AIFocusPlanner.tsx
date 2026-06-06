import React, { useState } from 'react';
import { useTimer } from './TimerContext';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Clock, ChevronRight, AlertCircle, Key, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playTactileSound } from '../utils';
import { AIFocusPlan } from '../types';

export default function AIFocusPlanner() {
  const { setTimerMode, setCustomMinutes, setSessionNote, isMuted } = useTimer();
  const [objective, setObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AIFocusPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Allow override API Key locally if not set in environment
  const envKey = (process.env.GEMINI_API_KEY as string) || '';
  const [localKey, setLocalKey] = useState(() => localStorage.getItem('berd_focus_local_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(localKey);

  const activeKey = envKey || localKey;

  const handleSaveKey = () => {
    localStorage.setItem('berd_focus_local_api_key', tempKey);
    setLocalKey(tempKey);
    setShowKeyInput(false);
    setError(null);
    if (!isMuted) playTactileSound(880, 'sine', 0.05);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    if (!activeKey) {
      setError('Gemini API key is required. Please configure an API key below to enable planning.');
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    setError(null);
    if (!isMuted) playTactileSound(523, 'sine', 0.1);

    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      
      const prompt = `You are a professional productivity coach. The user wants to accomplish the following objective today: "${objective}".
Break this down into a structured focus plan.
You must return a JSON object matching this exact TypeScript structure:
{
  "taskBreakdown": string[], // 3 to 5 clear, sequential sub-tasks to achieve the objective
  "focusBlocks": [
    {
      "name": string, // short title of the block, e.g. "Sprint 1: Layout"
      "duration": number, // duration of the block in minutes (must be between 15 and 50)
      "objective": string // specific focus objective for this block
    }
  ], // 2 to 4 focus blocks
  "estimatedDuration": number, // total estimated focus time in minutes (sum of focus blocks)
  "summary": string // 1-2 sentences of strategy/motivation
}
Only return valid JSON. Do not include markdown code block syntax (like \`\`\`json) or any explanation. Output only the JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (!response.text) {
        throw new Error('Empty response from Gemini API.');
      }

      const data = JSON.parse(response.text.trim()) as AIFocusPlan;
      setPlan(data);
      if (!isMuted) playTactileSound(1046, 'sine', 0.15);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate plan. Please verify your API key and network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadBlock = (block: any) => {
    if (!isMuted) playTactileSound(880, 'sine', 0.1);
    setTimerMode('work');
    setCustomMinutes(block.duration);
    setSessionNote(`${block.name}: ${block.objective}`);

    // Scroll to timer
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="planner" className="relative py-24 px-6 overflow-hidden bg-brand-bg border-b border-white/5">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-cyan-muted/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-display text-[10px] font-bold tracking-[0.25em] text-brand-cyan uppercase bg-brand-cyan-muted/10 px-4 py-1.5 rounded-full border border-brand-cyan/10 inline-block mb-6">
            AI Co-Pilot
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            AI Focus Planner
          </h2>
          <p className="font-sans text-base text-[#b9caca]/85 font-light leading-relaxed max-w-2xl mx-auto">
            Input your objective for today, and let Gemini structure it into customized, actionable focus sprints.
          </p>
        </div>

        {/* Input Card */}
        <div className="glass-card rounded-[24px] p-8 border border-white/10 shadow-2xl mb-8 relative">
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What do you want to accomplish today? (e.g. Build landing page homepage)"
                disabled={loading}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-sm text-[#dfe2f3] placeholder-[#b9caca]/40 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all font-sans leading-relaxed"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !objective.trim()}
              className="w-full sm:w-auto px-8 py-4 bg-brand-cyan text-brand-bg font-display text-xs font-bold tracking-widest uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,248,0.2)]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                  <span>Structuring...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Execution Interrupted</p>
                  <p className="leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* API Key Panel Toggle */}
          {!envKey && (
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-start">
              <button
                type="button"
                onClick={() => {
                  if (!isMuted) playTactileSound(880, 'sine', 0.02);
                  setShowKeyInput(!showKeyInput);
                }}
                className="text-[10px] font-display font-semibold tracking-wider text-brand-violet hover:text-white uppercase flex items-center gap-2"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{activeKey ? 'API Key Configured ✓' : 'Configure Gemini API Key'}</span>
              </button>

              <AnimatePresence>
                {showKeyInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full overflow-hidden mt-4"
                  >
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="password"
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder="Paste your Gemini API Key here"
                        className="flex-1 bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-violet/50"
                      />
                      <button
                        type="button"
                        onClick={handleSaveKey}
                        className="px-4 py-2 bg-brand-violet text-brand-bg rounded-lg font-display text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-colors"
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-[9px] text-[#b9caca]/40 mt-2 leading-relaxed">
                      API key is saved locally in your browser. Get a free API key from Google AI Studio.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Plan Display */}
        <AnimatePresence>
          {plan && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left"
            >
              {/* Left Column: Breakdown */}
              <div className="glass-card rounded-[24px] p-6 border border-white/10 lg:col-span-2 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <ListTodo className="w-5 h-5 text-brand-cyan" />
                    <h3 className="font-display font-semibold text-lg text-white">Execution Steps</h3>
                  </div>

                  <ul className="space-y-4 mb-6">
                    {plan.taskBreakdown.map((task, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                      >
                        <div className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center text-[10px] text-[#b9caca]/50 font-bold group-hover:border-brand-cyan/40 group-hover:text-brand-cyan transition-colors mt-0.5 shrink-0 font-display">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-[#b9caca] leading-relaxed font-light">
                          {task}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-brand-cyan-muted/5 border border-brand-cyan/20 rounded-xl p-4 mt-4">
                  <span className="font-display text-[9px] font-bold text-brand-cyan tracking-wider uppercase block mb-1">
                    Coach Strategy
                  </span>
                  <p className="font-sans text-xs text-[#b9caca]/85 leading-relaxed font-light">
                    {plan.summary}
                  </p>
                </div>
              </div>

              {/* Right Column: Focus Blocks */}
              <div className="flex flex-col gap-6 text-left">
                <div className="glass-card rounded-[24px] p-6 border border-white/10 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                      Focus Sprints
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-brand-cyan font-bold tracking-wider uppercase font-display">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>{plan.estimatedDuration}m Total</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {plan.focusBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleLoadBlock(block)}
                        className="group relative p-4 bg-black/40 rounded-xl border border-white/5 hover:border-brand-cyan/30 hover:bg-brand-cyan-muted/5 cursor-pointer transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-display text-[9px] font-bold text-brand-violet tracking-widest uppercase group-hover:text-brand-cyan transition-colors">
                            {block.name}
                          </span>
                          <span className="text-[10px] font-display font-bold text-[#b9caca]/40 bg-white/5 px-2 py-0.5 rounded border border-white/5 group-hover:text-brand-cyan group-hover:border-brand-cyan/20 transition-colors">
                            {block.duration}m
                          </span>
                        </div>
                        <h4 className="font-display font-medium text-xs text-white mb-1">
                          {block.objective}
                        </h4>
                        <span className="text-[9px] text-brand-cyan/80 font-display font-semibold tracking-wider uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-3">
                          <span>Queue to Timer</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
