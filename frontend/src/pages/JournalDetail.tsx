import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Tag, Brain, Sparkles, AlertCircle, Edit3, Save, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';

const JournalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await JournalStore.getEntry(id);
      if (data) {
        setEntry(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setMood(data.mood || 'Neutral');
      } else {
        setError('Entry not found');
      }
    } catch (err) {
      setError('Failed to load journal entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!content.trim() || !id) return;
    try {
      setSaving(true);
      const updateData = {
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        mood,
        tags: entry?.tags || ['Personal Reflection'],
        analysis: entry?.analysis || null
      };

      await JournalStore.updateEntry(id, updateData);

      setEntry((prev: any) => ({ ...prev, ...updateData }));
      setIsEditing(false);
      setSuccessMsg('Journal Entry Saved & Updated Successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update entry', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReAnalyze = async () => {
    if (!content.trim() || !id) return;
    try {
      setAnalyzing(true);
      const res = await api.post('/journals/analyze', { content });
      const updatedAnalysis = res.data;

      const updateData = {
        title,
        content,
        mood: res.data.mood || mood,
        tags: res.data.topics || entry?.tags || [],
        analysis: updatedAnalysis
      };

      await JournalStore.updateEntry(id, updateData);
      setEntry((prev: any) => ({ ...prev, ...updateData }));
      if (res.data.mood) setMood(res.data.mood);
      setSuccessMsg('AI Analysis Updated & Entry Saved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed AI analysis', err);
      alert(err?.response?.data?.error || 'AI re-analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await JournalStore.deleteEntry(id);
      navigate('/journal');
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'Recent Entry';
    if (dateVal._seconds) {
      return new Date(dateVal._seconds * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return 'Recent Entry';
    return parsed.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
    </div>
  );

  if (error || !entry) return (
    <div className="text-center py-20">
      <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold dark:text-white">{error || 'Entry not found'}</h2>
      <button onClick={() => navigate('/journal')} className="mt-4 text-indigo-600 font-medium">Back to History</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ApiKeyBanner onKeySaved={fetchEntry} />

      {successMsg && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle size={20} />
          {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/journal')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft size={18} />
          Back to History
        </button>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleReAnalyze}
                disabled={analyzing}
                className="px-4 py-2 border border-indigo-200 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-sm hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center gap-2"
              >
                {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                AI Re-Analyze
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Edit3 size={16} />
                Edit Entry
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm font-bold px-2 py-1"
              >
                <Trash2 size={18} />
                Delete Entry
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry Title"
                className="w-full text-3xl font-extrabold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white"
              />

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Mood:</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1 text-sm text-slate-700 dark:text-slate-300 font-medium"
                >
                  <option>Happy</option>
                  <option>Neutral</option>
                  <option>Sad</option>
                  <option>Stressed</option>
                  <option>Excited</option>
                  <option>Productive</option>
                  <option>Anxious</option>
                  <option>Reflective</option>
                </select>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium leading-relaxed"
              />
            </div>
          ) : (
            <>
              <header>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{entry.title}</h1>
                <div className="flex flex-wrap gap-4 items-center text-slate-500 dark:text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {formatDate(entry.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-xs border border-indigo-100 dark:border-indigo-900">
                      {entry.mood || 'Neutral'}
                    </span>
                  </div>
                </div>
              </header>

              <div className="card">
                <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                  {entry.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                {entry.tags?.map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* AI Analysis View */}
        <div className="space-y-6">
          {entry.analysis ? (
            <div className="card bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50 sticky top-8">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-6">
                <Sparkles size={20} />
                <h3 className="font-bold">AI Analysis Result</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Summary</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{entry.analysis.summary}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Reflection</h4>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 italic text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{entry.analysis.reflection}"
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Key Insights</h4>
                  <ul className="space-y-2">
                    {entry.analysis.keyInsights?.map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                        <span className="text-indigo-400">•</span> {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Action Items</h4>
                  <ul className="space-y-2">
                    {entry.analysis.actionItems?.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                        <span className="text-indigo-400 font-bold">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-10 bg-slate-50 dark:bg-slate-900 border-dashed border-2">
              <Brain className="text-slate-300 dark:text-slate-600 mx-auto mb-2" size={32} />
              <h4 className="font-bold text-slate-900 dark:text-white">No AI analysis yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Click "Edit Entry" and "AI Re-Analyze" to generate structured AI analysis.</p>
              <button
                onClick={() => { setIsEditing(true); handleReAnalyze(); }}
                className="btn-primary inline-flex items-center gap-1.5 text-xs"
              >
                <Sparkles size={14} /> Analyze Entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
