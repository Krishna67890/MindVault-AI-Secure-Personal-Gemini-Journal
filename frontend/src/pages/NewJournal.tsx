import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Loader2,
  Brain,
  Sparkles,
  CheckCircle,
  Shield,
  Type,
  Hash,
  Smile,
  Zap,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Wand2
} from 'lucide-react';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';
import { strings } from '../config/strings';

const NewJournal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // High-tech features
  const [isListening, setIsListening] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const navigate = useNavigate();

  // Web Speech Recognition setup
  const handleToggleVoiceDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(strings.newJournal.voiceSupportError);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setContent(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.start();
  };

  const handleAutoTitle = async () => {
    if (!content.trim()) return;
    setIsGeneratingTitle(true);
    try {
      const words = content.trim().split(' ').slice(0, 8).join(' ');
      setTitle(words.charAt(0).toUpperCase() + words.slice(1) + '...');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    try {
      setIsAnalyzing(true);
      setErrorMsg('');
      const res = await api.post('/journals/analyze', { content });
      setAnalysis(res.data);
      if (res.data.mood) setMood(res.data.mood);
    } catch (error: any) {
      console.error('Analysis failed', error);
      const msg = error?.response?.data?.error || 'Standard neural analysis generated.';
      setErrorMsg(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    try {
      setIsSaving(true);
      await JournalStore.saveEntry({
        title: title.trim() || 'Untitled Reflection',
        content: content.trim(),
        mood,
        tags: analysis?.topics || ['Personal Reflection'],
        analysis: analysis || null
      });

      setSuccessMsg(strings.newJournal.autoVaultSuccess);
      setTimeout(() => {
        navigate('/journal');
      }, 700);
    } catch (error) {
      console.error('Failed to save entry', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-8 pb-20 font-sans ${isFocusMode ? 'fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto max-w-none' : ''}`}>
      <ApiKeyBanner />

      {successMsg && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-[2rem] text-sm font-black flex items-center gap-3 shadow-2xl animate-in slide-in-from-right">
          <CheckCircle size={20} strokeWidth={3} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          {errorMsg}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-all text-xs font-black uppercase tracking-widest mb-1"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {strings.newJournal.header.backBtn}
          </button>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{strings.newJournal.header.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-500 border border-slate-200 dark:border-slate-800 transition-all"
            title={isFocusMode ? strings.newJournal.header.focusOff : strings.newJournal.header.focusOn}
          >
            {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          <button
            onClick={handleToggleVoiceDictation}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200'
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? strings.newJournal.header.listening : strings.newJournal.header.dictate}
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            {strings.newJournal.header.neuralSync}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !content}
            className="shimmer-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {strings.newJournal.header.vaultEntry}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-1 shadow-sm overflow-hidden glow-card">
            <div className="p-8 space-y-6">
              
              {/* Title Bar with Auto-Title Generator */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={strings.newJournal.editor.titlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 text-3xl font-black bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 p-0 text-slate-900 dark:text-white tracking-tight"
                />
                <button
                  type="button"
                  onClick={handleAutoTitle}
                  disabled={!content.trim() || isGeneratingTitle}
                  className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-indigo-200 dark:border-indigo-900/50 disabled:opacity-40"
                  title="Generate Auto-Title from content"
                >
                  {isGeneratingTitle ? <Loader2 size={14} className="animate-spin text-indigo-600" /> : <Wand2 size={14} />} {strings.newJournal.editor.autoTitle}
                </button>
              </div>

              {/* Mood & Date Bar */}
              <div className="flex flex-wrap gap-4 items-center border-b border-slate-100 dark:border-slate-900 pb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Smile size={14} className="text-indigo-500" />
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 cursor-pointer"
                  >
                    {strings.newJournal.editor.moods.map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Main Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={strings.newJournal.editor.contentPlaceholder}
                className="w-full min-h-[480px] bg-transparent border-none focus:ring-0 p-0 text-lg text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-700 resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Type size={14} />
                  <span className="text-[10px] font-mono font-bold uppercase">{content.length} {strings.newJournal.editor.chars}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Hash size={14} />
                  <span className="text-[10px] font-mono font-bold uppercase">{content.split(/\s+/).filter(Boolean).length} {strings.newJournal.editor.words}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-indigo-500">
                <Shield size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{strings.newJournal.editor.encrypted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Sidebar Analysis Drawer */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group overflow-hidden bg-slate-900 dark:bg-indigo-950/20 rounded-[2.5rem] border border-slate-800 dark:border-indigo-500/20 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{strings.newJournal.analysis.tag}</span>
                </div>
                {isAnalyzing && <Loader2 size={16} className="animate-spin text-indigo-400" />}
              </div>

              {!analysis && !isAnalyzing ? (
                <div className="space-y-4 py-4">
                  <h3 className="text-xl font-bold text-white">{strings.newJournal.analysis.empty.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    {strings.newJournal.analysis.empty.description}
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={!content}
                    className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest disabled:opacity-30"
                  >
                    {strings.newJournal.analysis.empty.button}
                  </button>
                </div>
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse" />
                    <Brain size={48} className="text-indigo-400 relative z-10 animate-bounce" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xs font-black text-white uppercase tracking-widest">{strings.newJournal.analysis.loading.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{strings.newJournal.analysis.loading.description}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{strings.newJournal.analysis.summary}</h4>
                    <p className="text-xs text-indigo-100/90 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                      {analysis.summary}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{strings.newJournal.analysis.nodes}</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topics?.map((topic: string) => (
                        <span key={topic} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 font-black uppercase">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{strings.newJournal.analysis.directive}</h4>
                    <div className="space-y-2">
                      {analysis.actionItems?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-slate-300 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJournal;
