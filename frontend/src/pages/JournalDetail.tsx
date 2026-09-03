import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  Brain,
  Sparkles,
  AlertCircle,
  Edit3,
  Save,
  Loader2,
  CheckCircle,
  Clock,
  Shield,
  Smile,
  Zap,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
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
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        setError('Vault record not found');
      }
    } catch (err) {
      setError('Neural link error');
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
      setSuccessMsg('Vault updated successfully.');
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
      setSuccessMsg('Neural re-analysis complete.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed AI analysis', err);
      alert(err?.response?.data?.error || 'AI re-analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const speakEntry = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${title}. ${content}`);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Erase this reflection from your vault permanently?')) return;
    try {
      await JournalStore.deleteEntry(id);
      navigate('/journal');
    } catch (err) {
      alert('Failed to erase record');
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
    <div className="flex flex-col items-center justify-center py-40 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full" />
        <Loader2 size={48} className="animate-spin text-indigo-600 dark:text-indigo-400 relative z-10" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Decrypting Vault Entry</p>
    </div>
  );

  if (error || !entry) return (
    <div className="max-w-2xl mx-auto py-32 text-center space-y-8">
      <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 border border-red-500/20 shadow-xl">
        <AlertCircle size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{error || 'Vault Access Denied'}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">The record you are looking for might have been erased or moved.</p>
      </div>
      <button
        onClick={() => navigate('/journal')}
        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
      >
        Back to History
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-sans">
      <ApiKeyBanner onKeySaved={fetchEntry} />

      {successMsg && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-[2rem] text-sm font-black flex items-center gap-3 shadow-2xl animate-in slide-in-from-right">
          <CheckCircle size={20} strokeWidth={3} />
          {successMsg}
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/journal')}
            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-black uppercase tracking-widest mb-1"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Vault Archive
          </button>
          <div className="flex items-center gap-4">
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
               {isEditing ? 'Edit Reflection' : entry.title || 'Untitled Thought'}
             </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isEditing && (
            <button
              onClick={speakEntry}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200'
              }`}
              title="Listen to Reflection (Text to Speech)"
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isSpeaking ? 'Stop Narration' : 'Listen'}
            </button>
          )}

          {isEditing ? (
            <>
              <button
                onClick={handleReAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 border border-slate-200 dark:border-slate-800 disabled:opacity-50"
              >
                {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                Neural Sync
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="shimmer-btn bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-900 dark:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Entry
              </button>
              <button
                onClick={handleDelete}
                className="p-3.5 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-1 shadow-sm overflow-hidden glow-card">
             {isEditing ? (
               <div className="p-8 space-y-6">
                 <input
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="Entry Title"
                   className="w-full text-3xl font-black bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white tracking-tight"
                 />
                 <textarea
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   rows={16}
                   className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none font-medium leading-relaxed"
                 />
               </div>
             ) : (
               <div className="p-8 md:p-12 space-y-8">
                 <div className="flex flex-wrap gap-4 items-center text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900 pb-6">
                   <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-wider">
                     <Clock size={14} className="text-indigo-500" />
                     <span>{formatDate(entry.createdAt)}</span>
                   </div>
                   {entry.mood && (
                     <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-wider">
                       <Smile size={14} className="text-amber-500" />
                       <span>{entry.mood}</span>
                     </div>
                   )}
                 </div>

                 <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap selection:bg-indigo-500/30">
                      {entry.content}
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100 dark:border-slate-900">
                   {entry.tags?.map((tag: string) => (
                     <span key={tag} className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                       #{tag}
                     </span>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-6">
          {entry.analysis ? (
            <div className="relative group overflow-hidden bg-slate-900 dark:bg-indigo-950/20 rounded-[2.5rem] border border-slate-800 dark:border-indigo-500/20 p-7 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Result</span>
                  </div>
                  {analyzing && <Loader2 size={16} className="animate-spin text-indigo-400" />}
                </div>

                <div className="space-y-6 animate-in fade-in duration-500">
                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Summary</h4>
                    <p className="text-xs text-indigo-100/90 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                      {entry.analysis.summary}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Action Directives</h4>
                    <div className="space-y-2">
                      {entry.analysis.actionItems?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-slate-300 font-medium">
                          <Zap size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 text-center space-y-4">
              <Brain size={36} className="text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Neural Map Missing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Generate AI analysis for this reflection.</p>
              </div>
              <button
                onClick={() => { setIsEditing(true); handleReAnalyze(); }}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
              >
                Analyze Now
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] space-y-2 shadow-sm">
             <div className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest">
                <Shield size={16} /> Encryption Status
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
               Protected by zero-access client encryption. Only authorized UID can decrypt this record.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
