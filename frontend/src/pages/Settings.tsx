import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Shield, Key, Save, AlertCircle, Sun, Moon, Palette, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const savedGemini = localStorage.getItem('user_gemini_api_key') || '';
    const savedClaude = localStorage.getItem('user_claude_api_key') || '';
    const savedProvider = localStorage.getItem('user_preferred_ai_provider') || 'gemini';
    setGeminiKey(savedGemini);
    setClaudeKey(savedClaude);
    setProvider(savedProvider);
  }, []);

  const saveApiKeys = () => {
    setSaving(true);
    try {
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
      setMessage({ type: 'success', text: 'AI API Configuration saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save API key configuration.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings & Preferences</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage your theme modes, AI model keys, and account preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Mode Selection Card */}
          <section className="card">
            <div className="flex items-center gap-2 mb-6">
              <Palette size={20} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Theme & Appearance</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose between Light Mode and Dark Mode for comfortable reflection day or night.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                    theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Sun size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Light Mode</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Clean & Bright</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-950/60 shadow-md ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                    <Moon size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Dark Mode</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Sleek & Mindful</p>
                  </div>
                </button>
              </div>

              {/* Instant Toggle Switch */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon size={18} className="text-amber-400" /> : <Sun size={18} className="text-indigo-600" />}
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>
            </div>
          </section>

          {/* AI Configuration Section */}
          <section className="card border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 mb-6">
              <Key size={20} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Model Configuration</h2>
            </div>

            <div className="space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your own Gemini API key (and optional Claude API key) to enable AI Chatbot and AI Analysis.
                Keys are stored <strong>strictly locally in your browser</strong> for privacy.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key (AIzaSy...)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Get free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium">Google AI Studio</a>.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Claude (Anthropic) API Key <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                    placeholder="Enter your Claude API Key (sk-ant...)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Get key at <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-medium">Anthropic Console</a>.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Active AI Model Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                  >
                    <option value="gemini">Gemini (Google AI)</option>
                    <option value="claude">Claude 3.5 Sonnet (Anthropic)</option>
                  </select>
                </div>

                <button
                  onClick={saveApiKeys}
                  disabled={saving}
                  className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 text-sm"
                >
                  {saving ? 'Saving...' : <><Save size={16} /> Save Configuration</>}
                </button>

                {message.text && (
                  <div className={`text-xs font-semibold flex items-center gap-1.5 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200' : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200'}`}>
                    <AlertCircle size={14} /> {message.text}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Profile Section */}
          <section className="card">
            <div className="flex items-center gap-2 mb-6">
              <User size={20} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-24 text-sm font-medium text-slate-500 dark:text-slate-400">Display Name</div>
                <div className="flex-1 text-slate-900 dark:text-white font-medium">{user?.displayName || 'Not set'}</div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-24 text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</div>
                <div className="flex-1 text-slate-900 dark:text-white font-medium">{user?.email}</div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 py-3">
                <div className="w-24 text-sm font-medium text-slate-500 dark:text-slate-400">UID</div>
                <div className="flex-1 text-slate-400 font-mono text-xs">{user?.uid}</div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="card bg-slate-900 text-white border-none shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Database size={20} />
              <h3 className="font-bold">System Architecture</h3>
            </div>
            <div className="space-y-3">
              <StatusItem label="Cloud Run Backend" status="Operational" />
              <StatusItem label="Cloud Firestore" status="Operational" />
              <StatusItem label="Gemini API" status="Operational" />
              <StatusItem label="Claude API" status="Operational" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, status }: any) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs text-slate-400">{label}</span>
    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold uppercase tracking-wider">
      {status}
    </span>
  </div>
);

export default Settings;
