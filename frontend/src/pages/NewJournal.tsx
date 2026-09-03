import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Brain, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { JournalStore } from '../services/journalStore';
import ApiKeyBanner from '../components/ApiKeyBanner';

const NewJournal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

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
      const msg = error?.response?.data?.error || 'AI analysis notice: standard analysis generated.';
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
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        mood,
        tags: analysis?.topics || ['Personal Reflection'],
        analysis: analysis || null
      });

      setSuccessMsg('Journal Entry Saved Successfully to Vault!');
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
    <div className="space-y-6">
      <ApiKeyBanner />

      {successMsg && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle size={20} />
          {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950 text-sm disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            AI Analyze
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !content}
            className="btn-primary flex items-center gap-2 shadow-md"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Entry
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Entry Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-extrabold bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-600 p-0 text-slate-900 dark:text-white"
          />

          <div className="flex gap-4 items-center">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
            <span className="text-xs text-slate-400 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="w-full h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium leading-relaxed"
          />
        </div>

        <div className="space-y-6">
          <div className="card bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-4">
              <Sparkles size={20} />
              <h3 className="font-bold">AI Insights</h3>
            </div>

            {!analysis && !isAnalyzing ? (
              <p className="text-xs text-indigo-600/80 dark:text-indigo-300 leading-relaxed font-medium">
                Write your thoughts and click "AI Analyze" to get automated summaries, mood detection, and growth insights.
              </p>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="text-sm text-indigo-600 dark:text-indigo-400 animate-pulse font-medium">AI is reflecting on your words...</p>
              </div>
            ) : errorMsg ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-xl text-xs space-y-2 border border-red-100 dark:border-red-900/50">
                <p className="font-bold">Analysis Notice</p>
                <p>{errorMsg}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Summary</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topics?.map((topic: string) => (
                      <span key={topic} className="px-2 py-1 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Reflective Thought</h4>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 italic text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{analysis.reflection}"
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Suggested Actions</h4>
                  <ul className="space-y-1">
                    {analysis.actionItems?.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex gap-2 font-medium">
                        <span className="text-indigo-400">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Private Vault</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              MindVault AI uses dual-layer persistence. Your entries are saved locally in your browser and synced securely with your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJournal;
