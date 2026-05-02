import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, TrendingUp, TrendingDown, ExternalLink, Code2, Terminal, Info, X } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { DashboardCard as CardProps } from '../types';

const COLORS = ['#D9E8ED', '#F6C065', '#E65D20', '#C31B0E', '#732353'];

export const DashboardCardComponent: React.FC<CardProps> = ({ 
  title, subtitle, data, visualization, actions, footer, width = 'full', codeSnippet, developerNotes 
}) => {
  const [showSpec, setShowSpec] = useState(false);
  const containerWidthClass = {
    full: 'col-span-full',
    half: 'md:col-span-1 col-span-full',
    third: 'lg:col-span-1 md:col-span-1 col-span-full'
  }[width];

  const renderVisualization = () => {
    switch (visualization) {
      case 'bar':
        const barData = Array.isArray(data) ? data : [];
        return (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#1E293B' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#1E293B' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ 
                    borderRadius: '4px', 
                    border: '1px solid #1E293B', 
                    backgroundColor: '#E5EAF0',
                    fontSize: '11px',
                    boxShadow: '4px 4px 0px #1E293B'
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="#E65D20" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
                {barData[0]?.value2 && (
                  <Bar 
                    dataKey="value2" 
                    fill="#1E293B" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'velocity':
      case 'line':
        const lineData = Array.isArray(data) ? data : [];
        return (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF0" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '4px', 
                    border: '1px solid #1E293B', 
                    backgroundColor: '#E5EAF0',
                    fontSize: '11px'
                  }} 
                />
                <Line 
                  type="stepAfter" 
                  dataKey="value" 
                  stroke={visualization === 'velocity' ? "#E65D20" : "#F6C065"} 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#E65D20', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pie':
        const pieData = Array.isArray(data) ? data : [];
        return (
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">
                {pieData.reduce((a: any, b: any) => a + (Number(b.value) || 0), 0).toLocaleString()}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Total</span>
            </div>
          </div>
        );
      case 'progress':
          const progressData = Array.isArray(data) ? data : [];
          return (
            <div className="space-y-4 py-4">
              {progressData.map((item: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                     className="h-full bg-orange-500 rounded-full" 
                     style={{ width: `${item.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white border-2 border-slate-900 rounded-xl overflow-hidden shadow-[4px_4px_0px_#1E293B] flex flex-col relative group",
        containerWidthClass
      )}
    >
      <div className="p-5 flex-1 relative">
        <div className="flex justify-between items-start mb-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 leading-tight tracking-tight">{title}</h3>
              <button 
                onClick={() => setShowSpec(!showSpec)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                title="View Component Specs"
              >
                <Code2 size={12} />
              </button>
            </div>
            {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
          </div>
          <button className="text-slate-400 hover:text-slate-900 cursor-pointer">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="mt-4">
          {renderVisualization()}
        </div>

        {visualization === 'metric-only' && (
          <div className="mt-2 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.value}</span>
              {data.trend && (
                <span className={cn(
                  "flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded",
                  data.trend.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                )}>
                  {data.trend.isUp ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                  {data.trend.value}%
                </span>
              )}
            </div>
            {data.list && Array.isArray(data.list) && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                {data.list.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">{item.value}</span>
                      {item.trend && (
                        <span className={item.trend >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {item.trend >= 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spec Overlay */}
        <AnimatePresence>
          {showSpec && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-[#0F172A] p-6 z-30 overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Terminal size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Developer Spec</span>
                </div>
                <button onClick={() => setShowSpec(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2 text-slate-300">
                    <Info size={12} />
                    <span className="text-[10px] font-bold uppercase">Implementation Notes</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    {developerNotes || "No specific deployment notes provided. Recommended for PMS integration."}
                  </p>
                </div>

                <div className="space-y-2">
                   <span className="text-[10px] font-bold text-indigo-300 uppercase">React Blueprint</span>
                   <div className="p-3 bg-black/40 rounded-lg border border-slate-700 font-mono text-[9px] text-emerald-400/90 whitespace-pre-wrap leading-tight">
                     {codeSnippet || "// Sample Blueprint\n<Card className=\"border-2\" />"}
                   </div>
                </div>

                <button 
                  onClick={() => navigator.clipboard.writeText(codeSnippet || "")}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Copy Component Code
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(actions || footer) && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-900 flex justify-between items-center gap-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
            {footer}
          </div>
          <div className="flex gap-2">
            {actions?.map((action, i) => (
              <button 
                key={i} 
                className="px-4 py-1.5 border-2 border-slate-900 bg-white hover:bg-slate-100 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#1E293B] active:shadow-none translate-y-[-2px] active:translate-y-0 transition-all flex items-center gap-1.5"
              >
                {action}
                {action === 'Details' && <ExternalLink size={12} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
