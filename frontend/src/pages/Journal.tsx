import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BookText, ChevronRight, Calendar, Edit3, Trash2 } from 'lucide-react';
import { JournalStore, JournalEntry } from '../services/journalStore';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await JournalStore.getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      await JournalStore.deleteEntry(id);
      setEntries(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/journal/${id}`);
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'Recent';
    if (dateVal._seconds) {
      return new Date(dateVal._seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return 'Recent';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredEntries = (entries || []).filter(entry =>
    (entry.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (entry.content || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Journal History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">An encrypted log of your personal thoughts, reflections, and progress.</p>
        </div>
        <Link to="/journal/new" className="btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 shadow-md">
          <Plus size={18} />
          New Entry
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search your journals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-bold">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="card text-center py-20 bg-slate-50 dark:bg-slate-900/50 border-dashed border-2">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
            <BookText size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No entries found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-sm">
            {search ? "We couldn't find anything matching your search." : "Your journal vault is currently empty."}
          </p>
          {!search && (
            <Link to="/journal/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} />
              Write First Entry
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/journal/${entry.id}`)}
              className="card hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex flex-col md:flex-row items-start md:items-center gap-4 cursor-pointer group relative"
            >
              <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex-shrink-0 font-bold border border-indigo-100 dark:border-indigo-900/40">
                <Calendar size={18} />
                <span className="text-[10px] uppercase mt-0.5">
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {entry.title || 'Untitled Entry'}
                  </h3>
                  {entry.mood && (
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-900">
                      {entry.mood}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-3 leading-relaxed">
                  {entry.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags?.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Explicit Action Buttons: Edit / Update & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEdit(e, entry.id)}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Edit / Update Entry"
                    >
                      <Edit3 size={14} /> Update
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, entry.id)}
                      className="px-3 py-1 bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
