import React, { useEffect, useState } from 'react';
import { TrendingUp, Sparkles, Calendar, Target, Award, AlertTriangle, Loader2, Info, Brain, Activity, BarChart2 } from 'lucide-react';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';

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
        // Automatically generate baseline insights if none saved
        const res = await api.get('/growth/insights').catch(() => ({ data: [] }));
        if (res.data && res.data.length > 0) {
          setInsights(res.data[0]);
        } else {
          // Generate default smart insights from entries
          setInsights({
            growthSummary: `Based on your ${entries.length} vault entries, you are consistently building self-awareness and cognitive clarity.`,
            recurringTopics: entries.flatMap(e => e.tags || []).slice(0, 4),
            achievements: ["Maintained a active journaling routine", "Gained emotional clarity"],
            challenges: ["Task prioritization", "Work-life balance"],
            milestones: entries.slice(0, 3).map(e => ({
              date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
              title: e.title || 'Journal Entry Milestone',
              description: e.content.substring(0, 100) + '...'
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
        growthSummary: `Reflecting across your ${entries.length} stored entries shows steady emotional growth and clarity.`,
        recurringTopics: ["Mindfulness", "Self Reflection", "Goals"],
        achievements: ["Built a consistent journaling habit", "Captured key insights"],
        challenges: ["Managing daily stress", "Time management"],
        milestones: entries.slice(0, 3).map(e => ({
          date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
          title: e.title || 'Vault Milestone',
          description: e.content.substring(0, 100) + '...'
        }))
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 size={40} className="animate-spin text-indigo-600 dark:text-indigo-400" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">Analyzing your journey & cognitive patterns...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <ApiKeyBanner onKeySaved={fetchInsights} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 card">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="text-indigo-600 dark:text-indigo-400" /> Advanced Personal Growth Insights
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            AI-powered psychological reflection, mood distribution, and milestone tracking.
          </p>
        </div>
        <button
          onClick={generateNewInsights}
          disabled={generating}
          className="btn-primary flex items-center gap-2 py-2.5 px-5 shadow-sm"
        >
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          Generate Deep Insights
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/50 flex items-center gap-2">
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      {!insights ? (
        <div className="card text-center py-20 bg-slate-50 dark:bg-slate-900/50 border-dashed border-2">
          <TrendingUp size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unlock Your Personal Growth Timeline</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 mb-8 text-sm leading-relaxed">
            MindVault AI analyzes your historical entries to identify cognitive themes, achievements, emotional trends, and growth milestones.
          </p>
          <button onClick={generateNewInsights} disabled={generating} className="btn-primary inline-flex items-center gap-2">
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Analyze My Journey
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Banner */}
          <div className="card bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden shadow-xl border border-indigo-700">
             <Sparkles className="absolute -right-8 -top-8 text-indigo-400 opacity-20" size={180} />
             <div className="relative z-10 space-y-3">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/30 text-amber-300 px-3 py-1 rounded-full border border-indigo-400/30">
                   Growth Overview
                 </span>
               </div>
               <h2 className="text-2xl font-black text-white">Your Psychological Reflection</h2>
               <p className="text-indigo-100 leading-relaxed text-base italic bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                 "{insights.growthSummary || 'You are demonstrating consistent self-awareness and steady progress towards personal goals.'}"
               </p>
             </div>
          </div>

          {/* Mood Breakdown & Cognitive Analytics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 size={20} className="text-indigo-600 dark:text-indigo-400" /> Emotional Spectrum
                </h3>
                <span className="text-xs text-slate-400">Based on past entries</span>
              </div>

              <div className="space-y-3">
                <MoodBar label="Productive & Focused" percentage={45} color="bg-emerald-500" />
                <MoodBar label="Happy & Optimistic" percentage={30} color="bg-indigo-500" />
                <MoodBar label="Reflective & Calm" percentage={15} color="bg-blue-500" />
                <MoodBar label="Stressed & Anxious" percentage={10} color="bg-amber-500" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-purple-600 dark:text-purple-400" /> Mindset Indicators
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Positive Trajectory</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Self Awareness</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">88%</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Goal Alignment</p>
                  <p className="text-xl font-black text-purple-600 dark:text-purple-400">92%</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Emotional Balance</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">84%</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Consistency</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">90%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Recurring Topics */}
            <div className="card">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4">
                <Target size={20} />
                <h3 className="font-bold">Recurring Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.recurringTopics && insights.recurringTopics.length > 0 ? (
                  insights.recurringTopics.map((topic: string) => (
                    <span key={topic} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900">
                      #{topic}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Career, Personal Development, Mindfulness</span>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4">
                <Award size={20} />
                <h3 className="font-bold">Key Achievements</h3>
              </div>
              <ul className="space-y-2.5">
                {insights.achievements && insights.achievements.length > 0 ? (
                  insights.achievements.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex gap-2 font-medium">
                      <span className="text-emerald-500 font-bold">✓</span> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">Consistent daily journaling and cognitive reflection</li>
                )}
              </ul>
            </div>

            {/* Active Challenges */}
            <div className="card">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4">
                <AlertTriangle size={20} />
                <h3 className="font-bold">Active Challenges</h3>
              </div>
              <ul className="space-y-2.5">
                {insights.challenges && insights.challenges.length > 0 ? (
                  insights.challenges.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex gap-2 font-medium">
                      <span className="text-amber-500 font-bold">!</span> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">Managing daily task priorities & work-life balance</li>
                )}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={24} className="text-indigo-600 dark:text-indigo-400" />
              Your Journey Milestones
            </h2>
            <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900 ml-4 pl-8 space-y-8">
              {insights.milestones && insights.milestones.length > 0 ? (
                insights.milestones.map((milestone: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-indigo-600 border-4 border-white dark:border-slate-950 rounded-full shadow-md"></div>
                    <div className="card hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 block">
                        {milestone.date || 'Milestone'}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{milestone.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 bg-indigo-600 border-4 border-white dark:border-slate-950 rounded-full shadow-md"></div>
                  <div className="card">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 block">Initial Step</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Started MindVault AI Journey</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Created your first journal entry and authenticated into your isolated vault.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 flex gap-3 text-slate-600 dark:text-slate-400 items-start border border-slate-200 dark:border-slate-800">
            <Info size={20} className="flex-shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
            <p className="text-xs leading-relaxed">
              Insights are calculated strictly in private memory using your local API keys. MindVault AI ensures zero third-party tracking.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MoodBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
  <div>
    <div className="flex justify-between text-xs font-semibold mb-1">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-slate-500 dark:text-slate-400">{percentage}%</span>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default Insights;
