import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { JournalStore, JournalEntry } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';
import {
  MessageSquare,
  BookText,
  TrendingUp,
  Calendar,
  Plus,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowUpRight,
  Flame,
  Search,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { strings } from '../config/strings';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    entries: 0,
    conversations: 0,
    streak: 1,
    growthScore: 88
  });
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [catalystIndex, setCatalystIndex] = useState(0);

  // Quick reflection state directly on dashboard
  const [quickThought, setQuickThought] = useState('');
  const [isSavingQuick, setIsSavingQuick] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [entries, convosRes, insightsRes] = await Promise.all([
        JournalStore.getEntries(),
        api.get('/chat').catch(() => ({ data: [] })),
        api.get('/growth/insights').catch(() => ({ data: [] }))
      ]);

      const convos = convosRes.data || [];
      const insights = insightsRes.data || [];

      setRecentEntries(entries);

      let currentStreak = entries.length > 0 ? 1 : 0;
      if (entries.length > 1) {
        currentStreak = Math.min(entries.length, 14);
      }

      setStats({
        entries: entries.length,
        conversations: convos.length,
        streak: currentStreak,
        growthScore: Math.min(80 + entries.length * 2, 98)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim()) return;
    try {
      setIsSavingQuick(true);
      await JournalStore.saveEntry({
        title: 'Quick Reflection',
        content: quickThought.trim(),
        mood: 'Reflective',
        tags: ['quick-reflection', 'dashboard'],
        analysis: null
      });
      setQuickThought('');
      setQuickSuccess(true);
      setTimeout(() => setQuickSuccess(false), 3000);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to save quick reflection', err);
    } finally {
      setIsSavingQuick(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return strings.dashboard.hero.greetings.morning;
    if (hour < 18) return strings.dashboard.hero.greetings.afternoon;
    return strings.dashboard.hero.greetings.evening;
  };

  const formatDate = (dateObj: any) => {
    if (!dateObj) return 'Just now';
    const date = dateObj._seconds ? new Date(dateObj._seconds * 1000) : new Date(dateObj);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredEntries = recentEntries.filter(entry =>
    (entry.title || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (entry.content || '').toLowerCase().includes(searchFilter.toLowerCase())
  ).slice(0, 4);

  if (loading) return (
    <div className="animate-pulse space-y-10 py-6">
      <div className="h-44 bg-slate-200 dark:bg-slate-800/50 rounded-[3rem] w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800/50 rounded-[2rem]"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      <ApiKeyBanner onKeySaved={fetchDashboardData} />

      {/* Hero Command Banner */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20">
        <Sparkles className="absolute -right-10 -top-10 opacity-20 rotate-12 pointer-events-none" size={260} />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={12} className="text-emerald-300" /> {strings.dashboard.hero.badge} • {stats.streak}{strings.dashboard.hero.streakSuffix}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {greeting()}, <br />
              <span className="text-indigo-200">
                {localStorage.getItem('user_profile_name') || user?.displayName?.split(' ')[0] || strings.dashboard.hero.fallbackName}
              </span>
            </h1>
            
            <p className="text-indigo-100/90 font-medium text-sm md:text-base leading-relaxed">
              {strings.dashboard.hero.descriptionPrefix}<span className="font-black text-white">{stats.entries}</span>{strings.dashboard.hero.descriptionSuffix}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/journal/new" className="shimmer-btn bg-white text-indigo-600 px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                <Plus size={18} strokeWidth={3} /> {strings.dashboard.hero.ctaReflection}
              </Link>
              <Link to="/chat" className="bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500/50 transition-all flex items-center gap-2">
                <MessageSquare size={18} /> {strings.dashboard.hero.ctaChat}
              </Link>
            </div>
          </div>

          {/* Interactive Streak & Growth Level Badge */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center min-w-[220px] space-y-3 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner">
              <Flame size={32} className="animate-pulse" />
            </div>
            <div>
              <p className="text-3xl font-black">{stats.streak} {strings.dashboard.hero.streakUnit}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">{strings.dashboard.hero.streakLabel}</p>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(stats.streak * 15, 100)}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BookText />} label={strings.dashboard.stats.reflections.label} value={stats.entries} trend={strings.dashboard.stats.reflections.trend} color="indigo" />
        <StatCard icon={<MessageSquare />} label={strings.dashboard.stats.aiSessions.label} value={stats.conversations} trend={strings.dashboard.stats.aiSessions.trend} color="violet" />
        <StatCard icon={<Flame />} label={strings.dashboard.stats.streak.label} value={`${stats.streak} ${strings.dashboard.hero.streakUnit}`} trend={strings.dashboard.stats.streak.trend} color="amber" />
        <StatCard icon={<TrendingUp />} label={strings.dashboard.stats.growth.label} value={`${stats.growthScore}%`} trend={strings.dashboard.stats.growth.trend} color="emerald" />
      </div>

      {/* Quick Thought Console directly on Dashboard */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{strings.dashboard.console.title}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{strings.dashboard.console.subtitle}</p>
            </div>
          </div>
          {quickSuccess && (
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              {strings.dashboard.console.success}
            </span>
          )}
        </div>

        <form onSubmit={handleQuickSave} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickThought}
            onChange={(e) => setQuickThought(e.target.value)}
            placeholder={strings.dashboard.console.placeholder}
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!quickThought.trim() || isSavingQuick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40"
          >
            {isSavingQuick ? strings.dashboard.console.buttonSaving : strings.dashboard.console.buttonVault}
          </button>
        </form>
      </section>

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Recent Reflections Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{strings.dashboard.recent.title}</h2>
            
            {/* Quick Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={strings.dashboard.recent.filterPlaceholder}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Link to="/journal" className="text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline">
                {strings.dashboard.recent.viewAll}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <Link key={entry.id} to={`/journal/${entry.id}`} className="block group">
                  <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800/80 p-7 rounded-[2.5rem] hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 group-hover:-translate-y-1 glow-card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{formatDate(entry.createdAt)}</span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {entry.title || strings.dashboard.recent.untitled}
                        </h3>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium mb-5 text-sm">
                      {entry.content}
                    </p>

                    <div className="flex items-center gap-2">
                      {entry.mood && (
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                          {entry.mood}
                        </span>
                      )}
                      {entry.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <BookText size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{strings.dashboard.recent.empty.title}</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">{strings.dashboard.recent.empty.description}</p>
                </div>
                <Link to="/journal/new" className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                  {strings.dashboard.recent.empty.button}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Tools & Daily Catalyst Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">{strings.dashboard.tools.title}</h2>
            <div className="space-y-3">
              <ToolButton to="/chat" icon={<MessageSquare />} label={strings.dashboard.tools.chat.label} color="bg-indigo-600" description={strings.dashboard.tools.chat.desc} />
              <ToolButton to="/insights" icon={<TrendingUp />} label={strings.dashboard.tools.insights.label} color="bg-violet-600" description={strings.dashboard.tools.insights.desc} />
              <ToolButton to="/weekly-reflection" icon={<Calendar />} label={strings.dashboard.tools.weekly.label} color="bg-emerald-600" description={strings.dashboard.tools.weekly.desc} />
            </div>
          </div>

          {/* Daily Catalyst Quote Generator */}
          <div className="relative group overflow-hidden bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{strings.dashboard.catalystSection.title}</span>
                </div>
                <button
                  onClick={() => setCatalystIndex((prev) => (prev + 1) % strings.dashboard.catalysts.length)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                  title={strings.dashboard.catalystSection.next}
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <h3 className="text-lg font-bold leading-relaxed italic text-indigo-100">
                "{strings.dashboard.catalysts[catalystIndex]}"
              </h3>

              <Link to="/journal/new" className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/10 p-3.5 rounded-2xl transition-all group/btn">
                <span className="font-black text-xs uppercase tracking-widest">{strings.dashboard.catalystSection.button}</span>
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => {
  const colors: any = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20',
    violet: 'from-violet-500 to-violet-600 shadow-violet-500/20',
    amber: 'from-amber-400 to-amber-500 shadow-amber-400/20',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20'
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-7 rounded-[2.5rem] hover:shadow-2xl transition-all group glow-card">
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {React.cloneElement(icon as React.ReactElement, { size: 22, strokeWidth: 2.5 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white mb-1.5">{value}</p>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Zap size={10} className="text-amber-500" /> {trend}
        </p>
      </div>
    </div>
  );
};

const ToolButton = ({ to, icon, label, description, color }: any) => (
  <Link to={to} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl hover:border-indigo-500/50 transition-all group shadow-sm">
    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: 2.5 })}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium truncate">{description}</p>
    </div>
    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
      <ChevronRight size={14} strokeWidth={3} />
    </div>
  </Link>
);

export default Dashboard;
