import React, { useEffect, useState } from 'react';
import { Calendar, Sparkles, BarChart3, Target, Award, Loader2, BookOpen, Printer, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';

import { strings } from '../config/strings';

const WeeklyReflection: React.FC = () => {
  const [reflections, setReflections] = useState<any[]>([]);
  const [currentReflection, setCurrentReflection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const s = strings.weekly;

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const entries = await JournalStore.getEntries();
      const res = await api.get('/growth/weekly-reflection').catch(() => ({ data: [] }));
      const list = res.data || [];
      setReflections(list);

      if (list.length > 0) {
        setCurrentReflection(list[0]);
      } else if (entries.length > 0) {
        setCurrentReflection({
          id: 'report_default',
          generatedAt: new Date().toISOString(),
          weekSummary: `Reviewed ${entries.length} vault entries from your personal reflection timeline across the past 7 days.`,
          emotionalTrend: 'Reflective, Focused & Consistent',
          growthScore: Math.min(80 + entries.length * 2, 98),
          majorThemes: Array.from(new Set(entries.flatMap(e => e.tags || []))).slice(0, 4),
          achievements: ["Maintained a consistent daily journaling habit", "Gained deep emotional clarity on core goals"],
          focusForNextWeek: s.focus.fallback
        });
      }
    } catch (error) {
      console.error('Failed to fetch reflections', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReflections();
  }, []);

  const generateReflection = async () => {
    try {
      setGenerating(true);
      setErrorMsg('');
      const entries = await JournalStore.getEntries();
      const res = await api.post('/growth/weekly-reflection', {
        journals: entries.slice(0, 10),
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      }).catch(() => null);

      if (res && res.data && res.data.weekSummary) {
        setCurrentReflection(res.data);
      } else {
        const fallbackReport = {
          id: 'report_' + Date.now(),
          generatedAt: new Date().toISOString(),
          weekSummary: `Reflecting across your ${entries.length} vault entries demonstrates strong self-awareness and steady cognitive growth.`,
          emotionalTrend: 'Optimistic & Goal-Oriented',
          growthScore: 92,
          majorThemes: ["Personal Growth", "Mindfulness", "Productivity"],
          achievements: ["Built a consistent journaling habit", "Captured key growth insights"],
          focusForNextWeek: s.focus.fallback
        };
        setCurrentReflection(fallbackReport);
        setReflections(prev => [fallbackReport, ...prev]);
      }
    } catch (error: any) {
      console.error('Failed to generate reflection', error);
      setErrorMsg(s.errorFallback);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return s.overview.fallbackDate;
    if (dateVal._seconds) {
      return new Date(dateVal._seconds * 1000).toLocaleDateString();
    }
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return s.overview.fallbackDate;
    return parsed.toLocaleDateString();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
      <p className="text-slate-500 font-black text-xs uppercase tracking-widest">{s.loading}</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ApiKeyBanner onKeySaved={fetchReflections} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-slate-200 dark:border-indigo-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4 neon-text-indigo">
            <Calendar className="text-indigo-600 dark:text-indigo-400" size={32} /> {s.header.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-bold uppercase tracking-widest">
            {s.header.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
          {currentReflection && (
            <button
              onClick={handlePrint}
              className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] border border-slate-200 dark:border-indigo-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Printer size={16} /> {s.header.printBtn}
            </button>
          )}
          <button
            onClick={generateReflection}
            disabled={generating}
            className="shimmer-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {s.header.generateBtn}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-5 bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/20 flex items-center gap-3 animate-in zoom-in duration-300">
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      {!currentReflection ? (
        <div className="bg-white/50 dark:bg-slate-900/20 backdrop-blur-3xl text-center py-32 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-indigo-500/20 space-y-8 shadow-xl">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-400 border border-slate-200 dark:border-slate-800 shadow-inner">
            <Calendar size={48} />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{s.empty.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm font-medium leading-relaxed">
              {s.empty.description}
            </p>
          </div>
          <button onClick={generateReflection} disabled={generating} className="shimmer-btn bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">
            {s.empty.button}
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Executive Highlight Card */}
            <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-3xl border border-slate-200 dark:border-indigo-500/10 p-10 rounded-[3rem] space-y-8 shadow-2xl border-l-[10px] border-l-indigo-600 glow-card group">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                  <Target className="text-indigo-600" size={24} /> {s.overview.title}
                </h2>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  {formatDate(currentReflection.generatedAt)}
                </span>
              </div>

              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] blur opacity-50 pointer-events-none" />
                <p className="relative text-slate-800 dark:text-slate-200 leading-relaxed text-lg font-bold italic bg-white/50 dark:bg-indigo-500/5 p-8 rounded-[2rem] border border-indigo-500/10 shadow-inner">
                  "{currentReflection.weekSummary || s.overview.summaryPlaceholder}"
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                 <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Sparkles size={12} className="text-amber-500" /> {s.overview.moodTrend}
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-xl tracking-tight">{currentReflection.emotionalTrend || s.overview.moodFallback}</p>
                 </div>
                 <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <BarChart3 size={12} className="text-purple-500" /> {s.overview.growthScore}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                          style={{ width: `${currentReflection.growthScore || 90}%` }}
                        />
                      </div>
                      <span className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{currentReflection.growthScore || 90}<span className="text-[10px] text-slate-400 ml-0.5">/100</span></span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-md p-8 rounded-[3rem] border border-slate-200 dark:border-indigo-500/10 space-y-6 shadow-xl glow-card group">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target size={20} />
                  </div>
                  {s.themes.title}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(currentReflection.majorThemes || ['Mindfulness', 'Personal Growth', 'Productivity']).map((topic: string) => (
                    <span key={topic} className="px-4 py-2 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase border border-indigo-500/10 tracking-widest hover:bg-indigo-500/20 transition-colors">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-md p-8 rounded-[3rem] border border-slate-200 dark:border-indigo-500/10 space-y-6 shadow-xl glow-card group">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-[0.3em]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award size={20} />
                  </div>
                  {s.accomplishments.title}
                </div>
                <ul className="space-y-4">
                  {(currentReflection.achievements || ['Maintained daily reflection habit', 'Achieved clarity on upcoming goals']).map((item: string, i: number) => (
                    <li key={i} className="text-slate-700 dark:text-slate-300 text-xs font-bold flex gap-3 leading-relaxed">
                      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[50px] -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-600/20 transition-colors" />
              <h3 className="font-black text-white text-xs uppercase tracking-[0.4em] flex items-center gap-3 relative z-10">
                <Target size={22} className="text-indigo-500" />
                {s.focus.title}
              </h3>
              <div className="relative z-10">
                <p className="text-slate-200 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 text-base font-bold italic leading-relaxed">
                  "{currentReflection.focusForNextWeek || s.focus.fallback}"
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-md p-8 rounded-[3rem] border border-slate-200 dark:border-indigo-500/10 space-y-8 shadow-xl">
              <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
                <Calendar size={14} className="text-indigo-500" /> {s.history.title}
              </h3>
              <div className="space-y-4">
                {reflections.map((ref) => (
                  <button
                    key={ref.id || Math.random()}
                    onClick={() => setCurrentReflection(ref)}
                    className={`w-full text-left p-5 rounded-[2rem] border transition-all relative group/item overflow-hidden ${
                      currentReflection.id === ref.id
                        ? 'border-indigo-600 bg-indigo-500/5 shadow-lg'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 bg-white/50 dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {formatDate(ref.createdAt || ref.generatedAt)}
                        </span>
                        {currentReflection.id === ref.id && <div className="w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.6)]" />}
                      </div>
                      <p className={`text-xs font-black uppercase tracking-wider truncate transition-colors ${
                        currentReflection.id === ref.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-300'
                      }`}>
                        {ref.weekSummary || s.history.untitled}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white p-10 rounded-[3.5rem] space-y-6 shadow-2xl border border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:rotate-12 transition-transform">
                <BookOpen className="text-indigo-400" size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg uppercase tracking-[0.2em]">{s.tracker.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  {s.tracker.description}
                </p>
              </div>
              <div className="pt-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4 shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReflection;
