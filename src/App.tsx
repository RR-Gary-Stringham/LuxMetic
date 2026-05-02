import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  Sparkles, 
  Layout, 
  Download, 
  History, 
  Settings, 
  Send,
  Zap,
  Hotel as HotelIcon,
  ChevronRight,
  Code,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Database,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardCard } from './types';
import { DashboardCardComponent } from './components/DashboardCard';
import { generateDashboard } from './lib/ai';
import { cn } from './lib/utils';

const PRESETS = [
  { id: '1', name: 'RevPAR & Demand Velocity', icon: Zap, prompt: 'Revenue management model for a luxury resort. Show RevPAR growth velocity, stay lead times (advance vs last-minute), and demand impact from nearby summer festivals.' },
  { id: '2', name: 'Digital Checkout Funnel', icon: Smartphone, prompt: 'Mobile vs Desktop conversion funnel. Visualize listing impressions, booking clicks, and abandonment reasons (price, friction, dates).' },
  { id: '3', name: 'Sentiment & Loyalty Loop', icon: Sparkles, prompt: 'Guest experience dashboard. NPS trends, top positive vs negative sentiment clusters from reviews, and repeat guest purchase journeys.' },
];

export default function App() {
  const [dashboard, setDashboard] = useState<DashboardCard[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Initial dashboard
  useEffect(() => {
    handleGenerate(PRESETS[0].prompt);
  }, []);

  const handleGenerate = async (query: string) => {
    setIsGenerating(true);
    setPrompt(query);
    try {
      const cards = await generateDashboard(query);
      setDashboard(cards);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    const fullSchema = {
      project: "LuxeMetric Prototype",
      timestamp: new Date().toISOString(),
      cards: dashboard
    };
    navigator.clipboard.writeText(JSON.stringify(fullSchema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-slate-900 font-sans overflow-hidden italic-headings">
      {/* Sidebar - Precision Engineered */}
      <aside className="w-72 bg-white border-r-2 border-slate-900 flex flex-col z-20">
        <div className="p-6 border-b-2 border-slate-900 flex items-center gap-3 bg-slate-900 text-white">
          <div className="w-10 h-10 bg-orange-500 border-2 border-white/20 flex items-center justify-center rounded-lg shadow-[2px_2px_0px_#E65D20]">
            <Hotel className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter leading-tight italic">LUXEMETRIC</h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Analytics Genius</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layout size={12} /> Optimization Models
              </h2>
            </div>
            <div className="space-y-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleGenerate(preset.prompt)}
                  className="w-full group text-left p-3 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 transition-all flex items-start gap-3"
                >
                  <div className="mt-0.5 p-1.5 bg-slate-100 rounded-lg group-hover:bg-orange-100 transition-colors border border-slate-200 group-hover:border-orange-200">
                    <preset.icon size={16} className="text-slate-600 group-hover:text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-slate-800 leading-tight group-hover:text-slate-900">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">High-fidelity archetype</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database size={12} /> Data Connectors
            </h2>
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 group cursor-pointer hover:text-slate-900">
                <span className="flex items-center gap-2 opacity-50">PMS (Opera/MWS)</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 group cursor-pointer hover:text-slate-900">
                <span className="flex items-center gap-2 opacity-50">CRS (Sabre/Amadeus)</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 group cursor-pointer hover:text-slate-900">
                <span className="flex items-center gap-2 opacity-50">Rev. Tool (Duetto)</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-indigo-100 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-[11px] font-black text-indigo-900 uppercase mb-1">Developer Mode</h4>
            <p className="text-[10px] text-indigo-600/80 leading-relaxed font-medium">
              Hover over cards to see React/Tailwind specs for replication.
            </p>
            <button className="mt-2 text-[10px] font-black text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              LEARN MORE <ArrowRight size={10} />
            </button>
          </div>
        </nav>

        <div className="p-4 border-t-2 border-slate-900">
          <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <Settings size={18} /> Configuration
          </button>
        </div>
      </aside>

      {/* Main Prototype Stage */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toolbar - Modern Professional */}
        <header className="h-16 bg-white border-b-2 border-slate-900 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 bg-slate-100 border-2 border-slate-900 rounded-lg">
              <button 
                onClick={() => setViewMode('desktop')}
                className={cn(
                  "p-1.5 rounded transition-all",
                  viewMode === 'desktop' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={cn(
                  "p-1.5 rounded transition-all",
                  viewMode === 'mobile' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Smartphone size={16} />
              </button>
            </div>
            <div className="h-4 w-[2px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <span className="text-slate-900">Live Simulation</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => setShowCode(true)}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-900 bg-white hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-[3px_3px_0px_#1E293B] active:shadow-none translate-y-[-3px] active:translate-y-0 transition-all"
             >
               <Code size={16} /> Export Blueprint
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-black uppercase tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,0.3)] active:shadow-none translate-y-[-3px] active:translate-y-0 transition-all">
               <Download size={16} /> Download Package
             </button>
          </div>
        </header>

        {/* Prototype Canvas */}
        <div className="flex-1 overflow-y-auto bg-pattern custom-scrollbar flex justify-center py-12 px-8">
          <motion.div 
            layout
            className={cn(
              "mx-auto transition-all duration-500",
              viewMode === 'desktop' ? "max-w-7xl w-full" : "max-w-[420px] w-full"
            )}
          >
            {/* AI Generation Status */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/10 backdrop-blur-[2px]"
                >
                  <div className="bg-white border-2 border-slate-900 p-10 rounded-2xl shadow-[12px_12px_0px_#1E293B] text-center space-y-6 max-w-sm">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-orange-500 border-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={32} className="text-orange-500 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 italic">Thinking...</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">
                        Architecting Visual Logic
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Analyzing occupancy velocity and demand signals from provided prompt...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              "grid gap-10",
              viewMode === 'desktop' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {dashboard.map((card) => (
                <DashboardCardComponent key={card.id} {...card} />
              ))}
            </div>

            {dashboard.length === 0 && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-48 text-slate-300">
                <div className="relative">
                  <Sparkles size={100} strokeWidth={1} className="opacity-20" />
                  <div className="absolute inset-0 animate-ping opacity-10">
                    <Sparkles size={100} strokeWidth={1} />
                  </div>
                </div>
                <p className="text-2xl font-black mt-6 uppercase tracking-tighter italic text-slate-400">Genius Engine Idle</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-2">Ready for Performance Data Ingestion</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* AI Control Center - Overlay Pattern */}
        <div className="p-10 shrink-0 bg-white border-t-2 border-slate-900 z-10">
          <div className="max-w-4xl mx-auto w-full">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-indigo-600 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50"></div>
              <div className="relative flex items-center bg-white border-2 border-slate-900 rounded-2xl p-2.5 shadow-[10px_10px_0px_#1E293B] hover:shadow-[14px_14px_0px_#1E293B] transition-all group-focus-within:translate-y-[-2px] group-focus-within:shadow-[16px_16px_0px_#1E293B]">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-orange-500">
                  <Sparkles size={28} />
                </div>
                <input 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate(prompt)}
                  placeholder="Describe your revenue model or analytics goal..."
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 font-bold text-slate-800 placeholder:text-slate-300 text-lg"
                />
                <button 
                  onClick={() => handleGenerate(prompt)}
                  disabled={isGenerating || !prompt}
                  className="bg-slate-900 text-white disabled:bg-slate-100 disabled:text-slate-400 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]"
                >
                  ENGINE GENERATE {isGenerating ? '...' : <Send size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-6">
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 Processing Engine v4.8
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                 Shadcn Library Active
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                 <div className="w-2 h-2 rounded-full bg-orange-500" />
                 Hotel Logic Loaded
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Export Modal */}
      <AnimatePresence>
        {showCode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              className="bg-white border-4 border-slate-900 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-[24px_24px_0px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="p-8 border-b-4 border-slate-900 flex justify-between items-center bg-slate-50">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Export Prototype Architecture</h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Technical System Specification for Full Replication</p>
                </div>
                <button 
                  onClick={() => setShowCode(false)}
                  className="w-12 h-12 border-4 border-slate-900 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 rounded-2xl transition-all font-black text-xl active:scale-95 shadow-[4px_4px_0px_#1E293B]"
                >
                   ✕
                </button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                <div className="w-64 border-r-4 border-slate-900 bg-slate-50 p-6 space-y-6">
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Sections</h5>
                    <div className="space-y-2">
                       <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-between">
                         Full Schema <Check size={12} />
                       </div>
                       <div className="px-3 py-2 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 opacity-50 cursor-not-allowed">
                         Tailwind Config
                       </div>
                       <div className="px-3 py-2 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 opacity-50 cursor-not-allowed">
                         Typescript Defs
                       </div>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                    <p className="text-[10px] text-emerald-800 font-bold leading-tight">
                       This JSON contains the layout hierarchy, visualization models, and developer notes for implementation.
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-[#0F172A] p-8 overflow-auto custom-scrollbar relative">
                   <button 
                    onClick={copyCode}
                    className="absolute right-10 top-10 z-10 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all active:scale-95"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Full JSON'}
                  </button>
                  <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
                    {JSON.stringify({
                      meta: {
                        app: "LuxeMetric",
                        version: "Prototype v1.0",
                        theme: "Shadcn Professional"
                      },
                      dashboard
                    }, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="p-8 border-t-4 border-slate-900 bg-slate-900 flex justify-between items-center">
                <p className="text-[11px] font-bold text-slate-400 max-w-lg">
                   The provided blueprint uses Recharts for data viz and Tailwind CSS for atomic layout. 
                   Component logic maps to the <span className="text-white">DashboardCardComponent</span> architectural pattern.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowCode(false)}
                    className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,0.5)] active:shadow-none translate-y-[-4px] active:translate-y-0 transition-all border-2 border-slate-900"
                  >
                    BACK TO WORKSPACE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .bg-pattern {
          background-image: radial-gradient(#CBD5E1 1.2px, transparent 1.2px);
          background-size: 24px 24px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border: 3px solid transparent;
          background-clip: padding-box;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
          border: 3px solid transparent;
          background-clip: padding-box;
        }
        .italic-headings h1, .italic-headings h2, .italic-headings h3 {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
