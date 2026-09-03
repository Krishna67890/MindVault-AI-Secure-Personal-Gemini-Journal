import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  BookText,
  Calendar,
  Trash2,
  ArrowUpRight,
  Sparkles,
  LayoutGrid,
  List,
  Download
} from 'lucide-react';
import { JournalStore, JournalEntry } from '../services/journalStore';
import { strings } from '../config/strings';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'compact'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await JournalStore.getEntries();
      setEntries(data || []);
    } catch (error) {
      console.error('Failed to fetch entries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(strings.journal.entry.deleteConfirm)) return;
    try {
      await JournalStore.deleteEntry(id);
      setEntries(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  const handleExportVault = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindvault_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return { month: 'JAN', day: '01', full: 'Jan 1, 2026' };
    const date = dateVal._seconds ? new Date(dateVal._seconds * 1000) : new Date(dateVal);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.toLocaleDateString('en-US', { day: '2-digit' }),
      full: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  };

  const filteredEntries = (entries || []).filter(entry => {
    const matchesSearch = (entry.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (entry.content || '').toLowerCase().includes(search.toLowerCase()) ||
      (entry.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesMood = selectedMood === 'All' || entry.mood === selectedMood;

    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-8 pb-20 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            <Sparkles size={12} /> {strings.journal.header.tag}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{strings.journal.header.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-lg">
            {strings.journal.header.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportVault}
            className="flex items-center gap-2 px-5 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Download size={16} /> {strings.journal.header.exportBtn}
          </button>
          <Link to="/journal/new" className="shimmer-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2">
            <Plus size={18} strokeWidth={3} /> {strings.journal.header.newBtn}
          </Link>
        </div>
      </div>

      {/* Control Bar (Search, Mood Filter, View Modes) */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={strings.journal.controls.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Mood Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {strings.journal.controls.moods.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                selectedMood === m
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-slate-400'}`}
            title={strings.journal.controls.viewModes.grid}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'timeline' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-slate-400'}`}
            title={strings.journal.controls.viewModes.timeline}
          >
            <Calendar size={16} />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'compact' ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm' : 'text-slate-400'}`}
            title={strings.journal.controls.viewModes.compact}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Main Entries Area */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800/50 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] py-28 text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <BookText size={36} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{strings.journal.emptyState.title}</h3>
            <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">
              {search || selectedMood !== 'All' ? strings.journal.emptyState.searchMatchError : strings.journal.emptyState.noRecords}
            </p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => {
            const date = formatDate(entry.createdAt);
            return (
              <div
                key={entry.id}
                onClick={() => navigate(`/journal/${entry.id}`)}
                className="group bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800/80 p-7 rounded-[2.5rem] hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer flex flex-col justify-between space-y-6 glow-card"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{date.full}</span>
                    {entry.mood && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {entry.mood}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-2">
                    {entry.title || strings.journal.entry.untitled}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-xs line-clamp-3">
                    {entry.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[9px] font-mono font-bold text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, entry.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-6 pl-10 space-y-8">
          {filteredEntries.map((entry) => {
            const date = formatDate(entry.createdAt);
            return (
              <div key={entry.id} className="relative group">
                <div className="absolute -left-[49px] top-0 w-6 h-6 bg-white dark:bg-slate-950 border-4 border-indigo-500 rounded-full group-hover:scale-125 transition-transform" />
                <div
                  onClick={() => navigate(`/journal/${entry.id}`)}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-7 rounded-[2rem] hover:border-indigo-500/50 cursor-pointer space-y-3 shadow-sm glow-card"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{date.full}</span>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{entry.title || strings.journal.entry.untitled}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2">{entry.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
          {filteredEntries.map((entry) => {
            const date = formatDate(entry.createdAt);
            return (
              <div
                key={entry.id}
                onClick={() => navigate(`/journal/${entry.id}`)}
                className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 font-black text-xs flex items-center justify-center flex-shrink-0">
                    {date.month}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                      {entry.title || strings.journal.entry.untitled}
                    </h4>
                    <p className="text-xs text-slate-400 truncate max-w-lg">{entry.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline-block">{date.full}</span>
                  <button
                    onClick={(e) => handleDelete(e, entry.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Journal;
