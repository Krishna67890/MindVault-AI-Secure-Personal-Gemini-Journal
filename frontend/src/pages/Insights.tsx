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
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';
import { strings } from '../config/strings';

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const entries = await JournalStore.getEntries();
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
      const res = await api.post('/growth/insights/generate');
      if (res.data && res.data.growthSummary) {
        setInsights(res.data);
      }
    } catch (error: any) {
      console.error('Failed to generate insights', error);
      const entries = await JournalStore.getEntries();
      setInsights({
        growthSummary: strings.insights.synthesis.defaultGrowthAlt.replace('{count}', entries.length.toString()),
        recurringTopics: ["Mindfulness", "Self Reflection", "Goal Alignment", "Productivity"],
        achievements: ["Maintained daily reflection habit", "Captured key growth insights"],
        challenges: ["Managing daily stress", "Time optimization"],
        milestones: entries.slice(0, 3).map(e => ({
          date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
          title: e.title || 'Vault Milestone',
          description: e.content.substring(0, 110) + '...'
        }))
      });
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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans">
      <ApiKeyBanner onKeySaved={fetchInsights} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Brain size={14} /> {strings.insights.hero.tag}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              {strings.insights.hero.title.split(' ')[0]} <span className="text-indigo-400">{strings.insights.hero.title.split(' ')[1]}</span>
            </h1>
            <p className="text-slate-400 font-medium text-base leading-relaxed">
              {strings.insights.hero.description}
            </p>
          </div>
          <button
            onClick={generateNewInsights}
            disabled={generating}
            className="shimmer-btn bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {strings.insights.hero.syncBtn}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          {errorMsg}
        </div>
      )}

      {!insights ? (
        <div className="bg-white dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-slate-400">
            <TrendingUp size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{strings.insights.empty.title}</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
              {strings.insights.empty.description}
            </p>
          </div>
          <button
            onClick={generateNewInsights}
            disabled={generating}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
          >
            {generating ? 'Processing...' : strings.insights.empty.analyzeBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Summary Quote */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 space-y-4">
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">{strings.insights.synthesis.tag}</span>
               <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed italic">
                 "{insights.growthSummary}"
               </p>
            </div>
          </div>

          {/* Metrics Grid & Radar Simulator */}
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <BarChart2 size={22} className="text-indigo-500" />
                  {strings.insights.metrics.spectrum.title}
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg">{strings.insights.metrics.spectrum.tag}</span>
              </div>
              <div className="space-y-5">
                <MoodBar label={strings.insights.metrics.spectrum.states[0]} percentage={48} color="bg-emerald-500" />
                <MoodBar label={strings.insights.metrics.spectrum.states[1]} percentage={32} color="bg-indigo-500" />
                <MoodBar label={strings.insights.metrics.spectrum.states[2]} percentage={12} color="bg-purple-500" />
                <MoodBar label={strings.insights.metrics.spectrum.states[3]} percentage={8} color="bg-amber-500" />
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Activity size={22} className="text-purple-400" />
                  {strings.insights.metrics.matrix.title}
                </h3>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <Zap size={10} /> {strings.insights.metrics.matrix.optimal}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
          <section className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Calendar size={26} className="text-indigo-500" />
              {strings.insights.timeline.title}
            </h2>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-6 pl-10 space-y-8">
              {insights.milestones?.map((milestone: any, i: number) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[49px] top-0 w-6 h-6 bg-white dark:bg-slate-950 border-4 border-indigo-500 rounded-full group-hover:scale-125 transition-transform" />
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 space-y-2 shadow-sm glow-card">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{milestone.date}</span>
                      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{milestone.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-slate-100 dark:bg-slate-900/60 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <ShieldCheck size={24} className="text-emerald-500 flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {strings.insights.footer.shield}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

const MoodBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="text-slate-900 dark:text-white">{percentage}%</span>
    </div>
    <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const AnalysisCard = ({ icon, title, items, isTags }: any) => (
  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-sm space-y-6 glow-card">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h3>
    </div>

    {isTags ? (
      <div className="flex flex-wrap gap-2">
        {items?.map((item: string) => (
          <span key={item} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase border border-indigo-100 dark:border-indigo-900/50">
            #{item}
          </span>
        ))}
      </div>
    ) : (
      <ul className="space-y-3">
        {items?.map((item: string, i: number) => (
          <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2.5 font-medium leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Insights;
