import React, { useState, useEffect } from 'react';
import { Key, Sparkles, X, CheckCircle, ExternalLink, Shield, Settings, Info, AlertCircle } from 'lucide-react';
import { strings } from '../config/strings';

interface ApiKeyBannerProps {
  onKeySaved?: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onKeySaved }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [hasKeys, setHasKeys] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const s = strings.apiKeyBanner;

  const checkKeys = () => {
    const gKey = localStorage.getItem('user_gemini_api_key') || '';
    const cKey = localStorage.getItem('user_claude_api_key') || '';
    const pPref = localStorage.getItem('user_preferred_ai_provider') || 'gemini';
    setGeminiKey(gKey);
    setClaudeKey(cKey);
    setProvider(pPref);
    setHasKeys(Boolean(gKey || cKey));
  };

  useEffect(() => {
    checkKeys();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey.trim()) {
      localStorage.setItem('user_gemini_api_key', geminiKey.trim());
    } else {
      localStorage.removeItem('user_gemini_api_key');
    }

    if (claudeKey.trim()) {
      localStorage.setItem('user_claude_api_key', claudeKey.trim());
    } else {
      localStorage.removeItem('user_claude_api_key');
    }

    localStorage.setItem('user_preferred_ai_provider', provider);
    setHasKeys(Boolean(geminiKey.trim() || claudeKey.trim()));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowModal(false);
      if (onKeySaved) onKeySaved();
    }, 1200);
  };

  return (
    <>
      {/* Mini Banner if no keys (Direct Start approach) */}
      {!hasKeys && !showModal && (
        <div className="group relative bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-indigo-600 dark:text-indigo-400 mb-6 animate-in fade-in slide-in-from-top-4 duration-500 gap-3">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-center sm:text-left">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span>Running MindVault Human AI (Direct mode). No API keys required.</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="font-black uppercase tracking-[0.2em] hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 whitespace-nowrap"
          >
            Setup Advanced Models
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-10 max-w-xl w-full shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 relative animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all z-20"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-600/10 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                  <Settings size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{s.modal.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                    <Shield size={10} /> {s.modal.subtitle}
                  </div>
                </div>
              </div>

              {savedSuccess ? (
                <div className="py-12 text-center text-emerald-600 dark:text-emerald-400 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle size={48} className="animate-bounce" />
                  </div>
                  <p className="font-black text-xl uppercase tracking-widest">{s.modal.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                          {s.modal.labels.gemini}
                        </label>
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 font-black uppercase tracking-widest"
                        >
                          {s.modal.links.geminiBtn} <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="relative group">
                        <input
                          type="password"
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                          {s.modal.labels.claude}
                        </label>
                        <a
                          href="https://console.anthropic.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 font-black uppercase tracking-widest"
                        >
                          {s.modal.links.claudeBtn} <ExternalLink size={10} />
                        </a>
                      </div>
                      <input
                        type="password"
                        value={claudeKey}
                        onChange={(e) => setClaudeKey(e.target.value)}
                        placeholder="sk-ant-..."
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
                        {s.modal.labels.provider}
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setProvider('gemini')}
                          className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            provider === 'gemini'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl'
                              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-300'
                          }`}
                        >
                          {s.modal.providers.geminiFull}
                        </button>
                        <button
                          type="button"
                          onClick={() => setProvider('claude')}
                          className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            provider === 'claude'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl'
                              : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-300'
                          }`}
                        >
                          {s.modal.providers.claudeFull}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm"
                    >
                      {s.modal.buttons.cancel}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 shimmer-btn bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl"
                    >
                      {s.modal.buttons.save}
                    </button>
                  </div>

                  <div className="flex items-start gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-500/10">
                    <AlertCircle size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/70 font-bold leading-relaxed">
                      {s.modal.securityNote}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ApiKeyBanner;
