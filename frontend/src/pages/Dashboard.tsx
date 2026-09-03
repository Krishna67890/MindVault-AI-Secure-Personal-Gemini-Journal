import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';
import {
  MessageSquare,
  BookText,
  TrendingUp,
  Calendar,
  Plus,
  ChevronRight,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    entries: 0,
    conversations: 0,
    streak: 1,
    insights: 0
  });
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      setRecentEntries(entries.slice(0, 4));

      // Calculate streak
      let currentStreak = entries.length > 0 ? 1 : 0;
      if (entries.length > 1) {
        currentStreak = Math.min(entries.length, 7);
      }

      setStats({
        entries: entries.length,
        conversations: convos.length,
        streak: currentStreak,
        insights: insights.length || entries.length
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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateObj: any) => {
    if (!dateObj) return 'Recent';
    if (dateObj._seconds) {
      return new Date(dateObj._seconds * 1000).toLocaleDateString();
    }
    const parsed = new Date(dateObj);
    if (isNaN(parsed.getTime())) return 'Recent';
    return parsed.toLocaleDateString();
  };

  if (loading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <ApiKeyBanner onKeySaved={fetchDashboardData} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 card">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {greeting()}, {user?.displayName?.split(' ')[0] || 'Reflector'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Take a moment to reflect on your thoughts and check your AI growth insights.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/journal/new" className="btn-primary flex items-center gap-2 py-2.5 shadow-md">
            <Plus size={18} /> New Entry
          </Link>
          <Link to="/chat" className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border border-indigo-100 dark:border-indigo-900">
            <MessageSquare size={18} /> AI Chatbot
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookText size={20} />} label="Journal Entries" value={stats.entries} color="bg-indigo-600" />
        <StatCard icon={<MessageSquare size={20} />} label="AI Conversations" value={stats.conversations} color="bg-blue-600" />
        <StatCard icon={<Clock size={20} />} label="Current Streak" value={`${stats.streak} days`} color="bg-amber-500" />
        <StatCard icon={<TrendingUp size={20} />} label="Growth Insights" value={stats.insights} color="bg-emerald-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Recent Entries List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookText size={20} className="text-indigo-600 dark:text-indigo-400" />
              Recent Journal Entries
            </h2>
            <Link to="/journal" className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">View all entries</Link>
          </div>

          <div className="space-y-4">
            {recentEntries.length > 0 ? (
              recentEntries.map(entry => (
                <Link key={entry.id} to={`/journal/${entry.id}`} className="block group">
                  <div className="card hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-slate-900 dark:text-white">
                        {entry.title || 'Untitled Entry'}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed">{entry.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.mood && (
                          <span className="text-[10px] uppercase font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                            {entry.mood}
                          </span>
                        )}
                        {entry.tags?.map((tag: string) => (
                          <span key={tag} className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="card text-center py-16 bg-slate-50 dark:bg-slate-900/50 border-dashed border-2">
                <BookText size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your vault is ready</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                  Write your first journal entry or start a conversation with the AI Chatbot to see stored logs.
                </p>
                <Link to="/journal/new" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={18} />
                  Write First Entry
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Quick Actions & Daily Prompt */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap size={20} className="text-amber-500" /> Quick Actions
          </h2>
          <div className="grid gap-3">
            <ActionButton to="/journal/new" icon={<Plus />} label="New Journal" sub="Write down your thoughts" />
            <ActionButton to="/chat" icon={<MessageSquare />} label="AI Chatbot" sub="Brainstorm & chat with AI" />
            <ActionButton to="/insights" icon={<TrendingUp />} label="Advanced Insights" sub="Personal growth trends" />
            <ActionButton to="/weekly-reflection" icon={<Calendar />} label="Weekly Report" sub="7-day automated review" />
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
            <Sparkles className="absolute -right-6 -top-6 text-indigo-400 opacity-25" size={140} />
            <div className="relative z-10">
              <span className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase bg-indigo-800/50 px-2.5 py-1 rounded-full border border-indigo-700">
                Daily Reflection Prompt
              </span>
              <h3 className="font-bold text-base mt-3 mb-2">
                "What is one thing you learned today that surprised you?"
              </h3>
              <p className="text-slate-300 text-xs mb-4 leading-relaxed">
                Reflecting on small daily moments helps build cognitive clarity and emotional resilience.
              </p>
              <Link to="/journal/new" className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md">
                Answer Prompt <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="card flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ to, icon, label, sub }: any) => (
  <Link to={to} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group shadow-sm">
    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sub}</p>
    </div>
    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
  </Link>
);

export default Dashboard;
