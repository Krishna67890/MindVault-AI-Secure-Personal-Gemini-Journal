import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  Loader2,
  Brain,
  Activity,
  BarChart2,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { JournalStore, JournalEntry } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';
import { strings } from '../config/strings';
import NeuralReflectionGraph from '../components/NeuralReflectionGraph';

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const entries = await JournalStore.getEntries();
      setJournalEntries(entries);
      if (entries.length > 0) {
        const res = await api.get('/growth/insights').catch(() => ({ data: [] }));
        if (res.data && res.data.length > 0) {
          setInsights(res.data[0]);
        } else {
          setInsights({
            growthSummary: strings.insights.synthesis.defaultGrowth.replace('{count}', entries.length.toString()),
            recurringTopics: Array.from(new Set(entries.flatMap(e => e.tags || []))).slice(0, 5),
            achievements: ["Maintained a consistent reflection habit", "Gained deep clarity on daily goals", "Built emotional resilience"],
            challenges: ["Task prioritization under high workload", "Work-life boundaries"],
            milestones: entries.slice(0, 3).map(e => ({
              date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
              title: e.title || 'Vault Reflection Milestone',
              description: e.content.substring(0, 110) + '...'
            }))
          });
        }
      } else {
        setInsights({
          growthSummary: "Start your journaling journey to generate your personalized Neural Reflection Graph.",
          recurringTopics: ["Mindfulness", "Self Discovery"],
          achievements: ["Vault Account Initialized"],
          challenges: ["First Entry Reflection"],
          milestones: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch insights', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const generateNewInsights = async () => {
    try {
      setGenerating(true);
      setErrorMsg('');
      const entries = await JournalStore.getEntries();
      setJournalEntries(entries);
      try {
        const res = await api.post('/growth/insights/generate');
        if (res.data && res.data.growthSummary) {
          setInsights(res.data);
        }
      } catch {
        setInsights({
          growthSummary: strings.insights.synthesis.defaultGrowthAlt.replace('{count}', entries.length.toString()),
          recurringTopics: Array.from(new Set(entries.flatMap(e => e.tags || []))).slice(0, 5),
          achievements: ["Maintained daily reflection habit", "Captured key growth insights"],
          challenges: ["Managing daily stress", "Time optimization"],
          milestones: entries.slice(0, 3).map(e => ({
            date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
            title: e.title || 'Vault Milestone',
            description: e.content.substring(0, 110) + '...'
          }))
        });
      }
    } catch (error: any) {
      console.error('Failed to generate insights', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full" />
        <Loader2 size={48} className="animate-spin text-indigo-600 dark:text-indigo-400 relative z-10" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">{strings.insights.loading}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ApiKeyBanner onKeySaved={fetchInsights} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] border border-slate-800 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] -mr-40 -mt-40 pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-700" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Brain size={14} className="text-indigo-400" /> {strings.insights.hero.tag}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] neon-text-indigo">
              {strings.insights.hero.title.split(' ')[0]} <span className="text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{strings.insights.hero.title.split(' ')[1]}</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
              {strings.insights.hero.description}
            </p>
          </div>
          <button
            onClick={generateNewInsights}
            disabled={generating}
            className="shimmer-btn bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {strings.insights.hero.syncBtn}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 animate-in zoom-in duration-300">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {errorMsg}
        </div>
      )}

      {!insights ? (
        <div className="bg-white/50 dark:bg-slate-900/20 backdrop-blur-3xl border-2 border-dashed border-slate-200 dark:border-indigo-500/20 rounded-[3.5rem] py-32 text-center space-y-8">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-400 border border-slate-200 dark:border-slate-800 shadow-inner">
            <TrendingUp size={48} />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{strings.insights.empty.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto font-medium leading-relaxed">
              {strings.insights.empty.description}
            </p>
          </div>
          <button
            onClick={generateNewInsights}
            disabled={generating}
            className="shimmer-btn bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {generating ? 'Processing...' : strings.insights.empty.analyzeBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Neural Reflection Graph Component */}
          <NeuralReflectionGraph entries={journalEntries} isSyncing={generating} />
          
          {/* Summary Quote */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 border border-slate-200 dark:border-indigo-500/20 space-y-6 shadow-2xl">
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Zap size={14} className="text-amber-500" /> {strings.insights.synthesis.tag}
               </span>
               <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight italic">
                 "{insights.growthSummary}"
               </p>
            </div>
          </div>

          {/* Metrics Grid & Radar Simulator */}
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 bg-white/80 dark:bg-slate-950/50 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-indigo-500/10 shadow-xl space-y-10 glow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <BarChart2 size={26} className="text-indigo-500" />
                  {strings.insights.metrics.spectrum.title}
                </h3>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">{strings.insights.metrics.spectrum.tag}</span>
              </div>
              <div className="space-y-7">
                <MoodBar label={strings.insights.metrics.spectrum.states[0]} percentage={48} color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                <MoodBar label={strings.insights.metrics.spectrum.states[1]} percentage={32} color="bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
                <MoodBar label={strings.insights.metrics.spectrum.states[2]} percentage={12} color="bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                <MoodBar label={strings.insights.metrics.spectrum.states[3]} percentage={8} color="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden space-y-10 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[80px] -mr-20 -mt-20 pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight">
                  <Activity size={26} className="text-purple-400" />
                  {strings.insights.metrics.matrix.title}
                </h3>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                  <Zap size={12} className="animate-pulse" /> {strings.insights.metrics.matrix.optimal}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 relative z-10">
                <MetricCard label={strings.insights.metrics.matrix.labels.awareness} value="94%" color="text-indigo-400" />
                <MetricCard label={strings.insights.metrics.matrix.labels.alignment} value="91%" color="text-purple-400" />
                <MetricCard label={strings.insights.metrics.matrix.labels.eq} value="88%" color="text-emerald-400" />
                <MetricCard label={strings.insights.metrics.matrix.labels.sync} value="96%" color="text-amber-400" />
              </div>
            </div>
          </div>

          {/* Analysis Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <AnalysisCard
              icon={<Target className="text-indigo-500" />}
              title={strings.insights.analysis.topics}
              items={insights.recurringTopics}
              isTags
            />
            <AnalysisCard
              icon={<Award className="text-emerald-500" />}
              title={strings.insights.analysis.accomplishments}
              items={insights.achievements}
            />
            <AnalysisCard
              icon={<AlertTriangle className="text-amber-500" />}
              title={strings.insights.analysis.opportunities}
              items={insights.challenges}
            />
          </div>

          {/* Timeline Section */}
          <section className="space-y-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4 uppercase tracking-[0.2em]">
              <Calendar size={32} className="text-indigo-500" />
              {strings.insights.timeline.title}
            </h2>

            <div className="relative border-l-2 border-slate-200 dark:border-indigo-500/20 ml-8 pl-12 space-y-10">
              {insights.milestones?.map((milestone: any, i: number) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[59px] top-0 w-8 h-8 bg-white dark:bg-slate-950 border-[6px] border-indigo-600 rounded-full group-hover:scale-125 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]" />
                  <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-indigo-500/10 rounded-[2.5rem] p-8 space-y-4 shadow-xl glow-card group-hover:-translate-y-2 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] font-mono">{milestone.date}</span>
                      <ArrowUpRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{milestone.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-slate-200 dark:border-indigo-500/10 flex items-center gap-6 shadow-lg">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed uppercase tracking-widest max-w-2xl">
              {strings.insights.footer.shield}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 transition-colors group/metric">
    <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">{label}</p>
    <p className={`text-3xl font-black ${color} group-hover:scale-110 transition-transform origin-left`}>{value}</p>
  </div>
);

const MoodBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="text-slate-900 dark:text-white bg-indigo-500/10 px-2 py-0.5 rounded-md">{percentage}%</span>
    </div>
    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const AnalysisCard = ({ icon, title, items, isTags }: any) => (
  <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-indigo-500/10 rounded-[3rem] p-8 shadow-xl space-y-8 glow-card group/analysis">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-inner group-hover/analysis:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">{title}</h3>
    </div>

    {isTags ? (
      <div className="flex flex-wrap gap-3">
        {items?.map((item: string) => (
          <span key={item} className="px-4 py-2 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase border border-indigo-500/10 tracking-widest hover:bg-indigo-500/20 transition-colors">
            #{item}
          </span>
        ))}
      </div>
    ) : (
      <ul className="space-y-4">
        {items?.map((item: string, i: number) => (
          <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-3 font-bold leading-relaxed">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 animate-pulse" />
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Insights;
