import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookText,
  MessageSquare,
  TrendingUp,
  Calendar,
  Settings,
  User,
  Plus,
  Moon,
  Sun,
  X,
  Command,
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';
import { JournalStore, JournalEntry } from '../services/journalStore';
import { useTheme } from '../contexts/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      JournalStore.getEntries().then(data => setEntries(data || [])).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent or window event
          window.dispatchEvent(new CustomEvent('open_command_palette'));
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { icon: Plus, label: 'Create New Reflection', action: () => navigate('/journal/new'), category: 'Action' },
    { icon: MessageSquare, label: 'Start AI Neural Chat', action: () => navigate('/chat'), category: 'Action' },
    { icon: TrendingUp, label: 'View Neural Insights', action: () => navigate('/insights'), category: 'Navigation' },
    { icon: Calendar, label: 'Generate Weekly Report', action: () => navigate('/weekly-reflection'), category: 'Navigation' },
    { icon: theme === 'dark' ? Sun : Moon, label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, action: () => toggleTheme(), category: 'Theme' },
    { icon: Settings, label: 'Open System Settings', action: () => navigate('/settings'), category: 'Navigation' },
    { icon: User, label: 'View Profile & Logo', action: () => navigate('/profile'), category: 'Navigation' },
  ];

  const filteredEntries = entries.filter(e =>
    (e.title || '').toLowerCase().includes(query.toLowerCase()) ||
    (e.content || '').toLowerCase().includes(query.toLowerCase()) ||
    (e.tags || []).some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const filteredActions = quickActions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (actionFn: () => void) => {
    actionFn();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Search Header Input */}
        <div className="relative flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
          <Search size={22} className="text-indigo-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search entries, or jump to..."
            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-0 text-base"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-mono font-bold">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 custom-scrollbar">

          {/* Quick Actions Section */}
          {filteredActions.length > 0 && (
            <div className="space-y-2">
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Command size={12} /> Commands & Navigation
              </div>
              <div className="space-y-1">
                {filteredActions.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(act.action)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-bold">{act.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase">
                          {act.category}
                        </span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Vault Entries */}
          {query.trim() && (
            <div className="space-y-2">
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <BookText size={12} /> Matching Reflections ({filteredEntries.length})
              </div>
              {filteredEntries.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs font-medium text-slate-400">
                  No encrypted records match "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredEntries.map(entry => (
                    <button
                      key={entry.id}
                      onClick={() => handleSelect(() => navigate(`/journal/${entry.id}`))}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                          <BookText size={16} />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                            {entry.title || 'Untitled Thought'}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-md">
                            {entry.content}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-indigo-500" />
            <span className="font-bold">MindVault Command Engine</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={12} className="text-emerald-500" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
