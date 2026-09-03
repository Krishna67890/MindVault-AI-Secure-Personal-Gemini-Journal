import React, { useState, useEffect } from 'react';
import { Key, Sparkles, X, CheckCircle, ExternalLink } from 'lucide-react';

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

  if (hasKeys && !showModal) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800 mb-6">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>AI API Key active ({provider === 'claude' ? 'Claude API' : 'Gemini API'}). Ready for AI Chatbot & Analysis!</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-emerald-700 underline font-bold hover:text-emerald-900"
        >
          Change Key
        </button>
      </div>
    );
  }

  return (
    <>
      {!hasKeys && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-700 mb-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center text-amber-300 border border-indigo-400/30 flex-shrink-0">
                <Key size={20} />
              </div>
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  Enter Your Own API Key to Unlock AI Features <Sparkles size={16} className="text-amber-300 animate-pulse" />
                </h4>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Add your Gemini API key (or optional Claude API key) to use AI Chatbot, Journal Auto-Analysis, Growth Insights, and Weekly Reports!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 flex-shrink-0"
            >
              <Key size={14} /> Enter API Key
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">AI API Key Settings</h3>
                <p className="text-xs text-slate-500">Stored locally in browser for max privacy</p>
              </div>
            </div>

            {savedSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle size={48} className="mx-auto" />
                <p className="font-bold text-lg">API Key Saved & Activated!</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">Get key from Google AI Studio</span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Get Gemini Key <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Claude (Anthropic) API Key <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">Get key from Anthropic Console</span>
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Get Claude Key <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred AI Model Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="gemini">Gemini (Google)</option>
                    <option value="claude">Claude (Anthropic)</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default ApiKeyBanner;
