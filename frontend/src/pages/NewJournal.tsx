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
      const msg = error?.response?.data?.error || strings.newJournal.analysis.errorFallback;
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
        title: title.trim() || strings.newJournal.editor.defaultTitle,
        content: content.trim(),
        mood,
        tags: analysis?.topics || [strings.newJournal.editor.defaultTag],
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
    <div className={`relative max-w-7xl mx-auto space-y-8 pb-20 font-sans transition-all duration-500 ${isFocusMode ? 'fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto max-w-none' : ''}`}>
      {/* Background decoration */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <ApiKeyBanner />

      {successMsg && (
        <div className="fixed top-24 right-8 z-[60] bg-emerald-600 text-white px-6 py-4 rounded-[2rem] text-sm font-black flex items-center gap-3 shadow-2xl animate-in slide-in-from-right border border-emerald-400/20">
          <CheckCircle size={20} strokeWidth={3} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="relative p-4 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {errorMsg}
        </div>
      )}

      {/* Header Actions */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-all text-[10px] font-black uppercase tracking-widest mb-1"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {strings.newJournal.header.backBtn}
          </button>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{strings.newJournal.header.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-3.5 rounded-2xl border transition-all ${
              isFocusMode
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:text-indigo-500 border-slate-200 dark:border-slate-800'
            }`}
            title={isFocusMode ? strings.newJournal.header.focusOff : strings.newJournal.header.focusOn}
          >
            {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <button
            onClick={handleToggleVoiceDictation}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/25'
                : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? strings.newJournal.header.listening : strings.newJournal.header.dictate}
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            {strings.newJournal.header.neuralSync}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !content}
            className="shimmer-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {strings.newJournal.header.vaultEntry}
          </button>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden glow-card">
            <div className="p-8 space-y-6">
              
              {/* Title Bar with Auto-Title Generator */}
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder={strings.newJournal.editor.titlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 text-3xl font-black bg-transparent border-none focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 p-0 text-slate-900 dark:text-white tracking-tight"
                />
                <button
                  type="button"
                  onClick={handleAutoTitle}
                  disabled={!content.trim() || isGeneratingTitle}
                  className="p-2.5 rounded-xl bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-indigo-500/10 disabled:opacity-40 transition-all"
                  title={strings.newJournal.editor.autoTitleTooltip}
                >
                  {isGeneratingTitle ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} {strings.newJournal.editor.autoTitle}
                </button>
              </div>

              {/* Mood & Date Bar */}
              <div className="flex flex-wrap gap-4 items-center border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800/50">
                  <Smile size={14} className="text-indigo-500" />
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 cursor-pointer"
                  >
                    {strings.newJournal.editor.moods.map(m => (
                      <option key={m} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{m}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800/50">
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
                className="w-full min-h-[520px] bg-transparent border-none focus:ring-0 p-0 text-lg text-slate-800 dark:text-slate-200 placeholder-slate-200 dark:placeholder-slate-800 resize-none font-medium leading-relaxed custom-scrollbar"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-5 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Type size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{content.length} {strings.newJournal.editor.chars}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Hash size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{content.split(/\s+/).filter(Boolean).length} {strings.newJournal.editor.words}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-500">
                <Shield size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{strings.newJournal.editor.encrypted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Sidebar Analysis Drawer */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group overflow-hidden bg-slate-900 dark:bg-indigo-950/20 rounded-[2.5rem] border border-slate-800 dark:border-indigo-500/20 p-8 shadow-2xl min-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{strings.newJournal.analysis.tag}</span>
                </div>
                {isAnalyzing && <Loader2 size={16} className="animate-spin text-indigo-400" />}
              </div>

              {!analysis && !isAnalyzing ? (
                <div className="space-y-5 py-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{strings.newJournal.analysis.empty.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium opacity-80">
                    {strings.newJournal.analysis.empty.description}
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={!content}
                    className="w-full mt-4 bg-white/5 hover:bg-indigo-500 border border-white/10 hover:border-indigo-400 text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-30 shadow-lg hover:shadow-indigo-500/20"
                  >
                    {strings.newJournal.analysis.empty.button}
                  </button>
                </div>
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl animate-pulse" />
                    <Brain size={56} className="text-indigo-400 relative z-10 animate-bounce" />
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{strings.newJournal.analysis.loading.title}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em]">{strings.newJournal.analysis.loading.description}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="space-y-3">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">{strings.newJournal.analysis.summary}</h4>
                    <p className="text-xs text-indigo-100/90 leading-relaxed font-medium bg-white/5 p-5 rounded-3xl border border-white/5 shadow-inner">
                      {analysis.summary}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">{strings.newJournal.analysis.nodes}</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topics?.map((topic: string) => (
                        <span key={topic} className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] text-indigo-300 font-black uppercase tracking-wider">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">{strings.newJournal.analysis.directive}</h4>
                    <div className="space-y-3">
                      {analysis.actionItems?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-3 text-xs text-slate-300 font-medium group/item">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform shadow-lg shadow-indigo-500/50" />
                          <span className="opacity-90 leading-relaxed">{item}</span>
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
