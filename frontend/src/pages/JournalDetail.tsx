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
  X,
  Calendar,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';
import { strings } from '../config/strings';

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

  const s = strings.journalDetail;

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
        setError(s.error.notFound);
      }
    } catch (err) {
      setError(s.error.linkError);
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
        title: title.trim() || s.header.untitled,
        content: content.trim(),
        mood,
        tags: entry?.tags || ['Personal Reflection'],
        analysis: entry?.analysis || null
      };

      await JournalStore.updateEntry(id, updateData);

      setEntry((prev: any) => ({ ...prev, ...updateData }));
      setIsEditing(false);
      setSuccessMsg(s.success.updated);
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
      setSuccessMsg(s.success.analyzed);
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
    if (!id || !window.confirm(s.actions.deleteConfirm)) return;
    try {
      await JournalStore.deleteEntry(id);
      navigate('/journal');
    } catch (err) {
      alert('Failed to erase record');
    }
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return s.entry.fallbackDate;
    if (dateVal._seconds) {
      return new Date(dateVal._seconds * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return s.entry.fallbackDate;
    return parsed.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 space-y-10 animate-in fade-in duration-1000">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/30 blur-[100px] animate-pulse rounded-full" />
        <div className="relative bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <Loader2 size={64} className="animate-spin text-indigo-600 dark:text-indigo-400 relative z-10" />
        </div>
      </div>
      <div className="space-y-3 text-center">
        <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.6em] animate-pulse">{s.loading}</p>
        <div className="flex justify-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        </div>
      </div>
    </div>
  );

  if (error || !entry) return (
    <div className="max-w-3xl mx-auto py-40 text-center space-y-12 animate-in zoom-in duration-500">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full" />
        <div className="relative w-32 h-32 bg-white dark:bg-slate-950 rounded-[3.5rem] flex items-center justify-center mx-auto text-red-500 border border-red-500/20 shadow-2xl">
          <AlertCircle size={56} />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{error || s.error.denied}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg uppercase tracking-wider opacity-70">{s.error.description}</p>
      </div>
      <button
        onClick={() => navigate('/journal')}
        className="shimmer-btn bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5.5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all"
      >
        {s.error.backBtn}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <ApiKeyBanner onKeySaved={fetchEntry} />

      {successMsg && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-10 py-5 rounded-[2.5rem] text-sm font-black flex items-center gap-4 shadow-[0_20px_50px_rgba(16,185,129,0.4)] animate-in slide-in-from-right-10 duration-500 border border-white/20">
          <CheckCircle size={22} strokeWidth={3} />
          <span className="uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 px-2">
        <div className="space-y-6">
          <button
            onClick={() => navigate('/journal')}
            className="group inline-flex items-center gap-4 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-[10px] font-black uppercase tracking-[0.4em] mb-2"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-3 transition-transform" />
            {s.header.back}
          </button>
          <div className="space-y-3">
             <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">{s.header.untitled}</span>
             </div>
             <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] max-w-4xl">
               {isEditing ? s.header.edit : entry.title || s.header.untitled}
             </h1>
             <div className="flex flex-wrap items-center gap-5 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] pt-4">
                <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                  <Calendar size={14} className="text-indigo-500" />
                  {formatDate(entry.createdAt)}
                </div>
                {entry.mood && (
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20 shadow-sm">
                    <Smile size={14} />
                    {entry.mood}
                  </div>
                )}
                <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 shadow-sm">
                  <Shield size={14} />
                  {s.security.title}
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {!isEditing && (
            <button
              onClick={speakEntry}
              className={`flex items-center gap-4 px-8 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border shadow-lg ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {isSpeaking ? s.actions.stop : s.actions.listen}
            </button>
          )}

          {isEditing ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleReAnalyze}
                disabled={analyzing}
                className="flex items-center gap-4 px-8 py-5 rounded-[1.5rem] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-slate-200 dark:border-slate-800 disabled:opacity-50 transition-all shadow-lg"
              >
                {analyzing ? <Loader2 size={20} className="animate-spin" /> : <Brain size={20} className="text-indigo-500" />}
                {s.actions.sync}
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="shimmer-btn bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {s.actions.save}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all bg-white dark:bg-slate-950 shadow-lg hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="shimmer-btn bg-slate-900 dark:bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
              >
                <Edit3 size={20} />
                {s.actions.edit}
              </button>
              <button
                onClick={handleDelete}
                className="p-5 rounded-[1.5rem] border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg bg-white dark:bg-slate-950 group"
              >
                <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[3.5rem] p-1 shadow-sm overflow-hidden glow-card relative group">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -mr-64 -mt-64 pointer-events-none group-hover:bg-indigo-600/10 transition-all duration-1000" />
             <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

             {isEditing ? (
               <div className="p-12 md:p-16 space-y-10 relative z-10">
                 <input
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="Reflection Title..."
                   className="w-full text-5xl font-black bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white tracking-tighter p-0 placeholder:text-slate-200 dark:placeholder:text-slate-900 transition-all"
                 />
                 <textarea
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   rows={15}
                   className="w-full bg-transparent border-none focus:ring-0 p-0 text-xl text-slate-800 dark:text-slate-200 placeholder-slate-200 dark:placeholder:text-slate-900 resize-none font-bold leading-[1.8] custom-scrollbar"
                 />
               </div>
             ) : (
               <div className="p-12 md:p-20 space-y-16 relative z-10">
                 <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-[1.9] font-bold whitespace-pre-wrap selection:bg-indigo-500/40 tracking-tight">
                      {entry.content}
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-4 pt-16 border-t border-slate-100 dark:border-slate-900/50">
                   {entry.tags?.map((tag: string) => (
                     <span key={tag} className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-default shadow-sm">
                       #{tag}
                     </span>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-8">
          {entry.analysis ? (
            <div className="relative group overflow-hidden bg-slate-950 rounded-[3.5rem] border border-slate-800 shadow-2xl p-10 space-y-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700" />
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/5">
                    <Sparkles size={18} strokeWidth={2.5} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{s.analysis.tag}</span>
                  </div>
                  {analyzing && <Loader2 size={20} className="animate-spin text-indigo-400" />}
                </div>

                <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                  <section className="space-y-5">
                    <div className="flex items-center gap-3 text-indigo-400/80">
                       <Layers size={16} />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{s.analysis.summary}</h4>
                    </div>
                    <div className="text-sm text-indigo-100/90 leading-[1.8] font-bold bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-sm">
                      {entry.analysis.summary}
                    </div>
                  </section>

                  <section className="space-y-5">
                    <div className="flex items-center gap-3 text-indigo-400/80">
                       <Zap size={16} />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{s.analysis.directives}</h4>
                    </div>
                    <div className="space-y-4">
                      {entry.analysis.actionItems?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-5 text-xs text-slate-300 font-bold group/item bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-indigo-600/10 hover:border-indigo-500/20 transition-all shadow-sm">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-12 text-center space-y-8 group hover:border-indigo-500/40 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-indigo-600/10 transition-all duration-500 border border-slate-100 dark:border-slate-800">
                <Brain size={48} className="text-slate-200 dark:text-slate-800 group-hover:text-indigo-500 transition-colors" />
              </div>
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-[0.3em]">{s.analysis.missing.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed px-6 uppercase tracking-wider opacity-60">{s.analysis.missing.description}</p>
              </div>
              <button
                onClick={() => { setIsEditing(true); handleReAnalyze(); }}
                className="w-full shimmer-btn bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] transition-all"
              >
                {s.analysis.missing.button}
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-10 rounded-[3.5rem] space-y-5 shadow-sm relative overflow-hidden group">
             <div className="flex items-center gap-4 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">
                <Shield size={22} className="group-hover:rotate-12 transition-transform" /> {s.security.title}
             </div>
             <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed opacity-80">
               {s.security.description}
             </p>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mb-16 group-hover:bg-emerald-500/10 transition-all duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
