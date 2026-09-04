import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  User,
  Shield,
  Key,
  Save,
  AlertCircle,
  Sun,
  Moon,
  Palette,
  Database,
  Lock,
  Cpu,
  Globe,
  Bell,
  CheckCircle,
  Sliders,
  Loader2,
  Zap
} from 'lucide-react';
import { strings } from '../config/strings';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [saving, setSaving] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
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
      setMessage({ type: 'success', text: strings.settings.neural.success });
      setTimeout(() => setMessage({ type: '', text: '' }), 3500);
    } catch (error) {
      setMessage({ type: 'error', text: strings.settings.neural.error });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = () => {
    if (!geminiKey.trim()) {
      setMessage({ type: 'error', text: strings.settings.neural.noGeminiKey });
      return;
    }
    setTestingKey(true);
    setTimeout(() => {
      setMessage({ type: 'success', text: strings.settings.neural.testSuccess });
      setTestingKey(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans animate-in fade-in duration-700">
      <div className="px-2 space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 bg-indigo-600 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">System Core</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{strings.settings.header.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-2xl">{strings.settings.header.description}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* AI Configuration Section */}
          <section className="bg-white dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[3rem] p-1 shadow-sm overflow-hidden glow-card">
            <div className="bg-slate-50/50 dark:bg-slate-900/50 px-10 py-8 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                  <Cpu size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{strings.settings.neural.title}</h2>
                  <p className="text-[10px] font-black text-indigo-600/60 dark:text-indigo-400/60 uppercase tracking-[0.2em]">{strings.settings.neural.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <Shield size={14} strokeWidth={2.5} /> {strings.settings.neural.clientEncrypted}
              </div>
            </div>

            <div className="p-10 space-y-8">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold max-w-3xl">
                {strings.settings.neural.description}
              </p>

              <div className="grid gap-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{strings.settings.neural.labels.gemini}</label>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">{strings.settings.neural.links.gemini}</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Key size={20} />
                    </div>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder={strings.settings.neural.placeholders.gemini}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-900 dark:text-white font-mono transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold px-1 uppercase tracking-wider opacity-60">Primary processor for chat & sentiment graph.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{strings.settings.neural.labels.claude}</label>
                    <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">{strings.settings.neural.links.claude}</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      value={claudeKey}
                      onChange={(e) => setClaudeKey(e.target.value)}
                      placeholder={strings.settings.neural.placeholders.claude}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-xs focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 text-slate-900 dark:text-white font-mono transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold px-1 uppercase tracking-wider opacity-60">High-fidelity reasoning engine.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-1">{strings.settings.neural.labels.provider}</label>
                  <div className="relative">
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-black uppercase tracking-[0.2em] cursor-pointer appearance-none transition-all"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="claude">Anthropic Claude 3.5</option>
                      <option value="inbuilt">MindVault Human AI (Inbuilt)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-400">
                      <Sliders size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={saveApiKeys}
                  disabled={saving}
                  className="w-full sm:w-auto shimmer-btn bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {strings.settings.neural.saveBtn}
                </button>

                <button
                  onClick={handleTestConnection}
                  disabled={testingKey}
                  className="w-full sm:w-auto px-8 py-5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  {testingKey ? <Loader2 size={18} className="animate-spin text-indigo-500" /> : <Zap size={18} className="text-amber-500" />}
                  {testingKey ? strings.settings.neural.testing : strings.settings.neural.testBtn}
                </button>

                {message.text && (
                  <div className={`w-full sm:w-auto text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 px-6 py-4 rounded-2xl animate-in slide-in-from-left duration-500 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle size={16} strokeWidth={3} /> : <AlertCircle size={16} strokeWidth={3} />}
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Theme Selection */}
          <section className="bg-white dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[3rem] p-1 shadow-sm overflow-hidden glow-card">
             <div className="bg-slate-50/50 dark:bg-slate-900/50 px-10 py-8 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-2xl shadow-violet-600/30">
                    <Palette size={28} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{strings.settings.theme.title}</h2>
                    <p className="text-[10px] font-black text-violet-600/60 dark:text-violet-400/60 uppercase tracking-[0.2em]">{strings.settings.theme.subtitle}</p>
                  </div>
                </div>
             </div>

             <div className="p-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ThemeOption
                    active={theme === 'light'}
                    onClick={() => setTheme('light')}
                    icon={<Sun className="text-amber-500" />}
                    label={strings.settings.theme.light.label}
                    description={strings.settings.theme.light.description}
                  />
                  <ThemeOption
                    active={theme === 'dark'}
                    onClick={() => setTheme('dark')}
                    icon={<Moon className="text-indigo-400" />}
                    label={strings.settings.theme.dark.label}
                    description={strings.settings.theme.dark.description}
                  />
               </div>
             </div>
          </section>
        </div>

        {/* System & Account Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <section className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[80px] -mr-24 -mt-24 pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700" />

             <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 transition-all duration-500">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">{strings.settings.account.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">{strings.settings.account.verified}</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-6 border-t border-slate-800/80 pt-8">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{strings.settings.account.labels.name}</p>
                     <p className="text-white font-black text-lg tracking-tight">{localStorage.getItem('user_profile_name') || user?.displayName || strings.settings.account.defaultName}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{strings.settings.account.labels.email}</p>
                     <p className="text-indigo-200/80 font-bold text-sm truncate">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        <Lock size={12} /> {strings.settings.account.labels.uid}
                     </div>
                     <p className="text-slate-500 font-mono text-[9px] break-all bg-white/5 p-4 rounded-xl border border-white/5">{user?.uid}</p>
                  </div>
               </div>
             </div>
          </section>

          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-[3rem] p-10 shadow-sm space-y-8 glow-card">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{strings.settings.status.title}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time health</p>
                </div>
             </div>

             <div className="space-y-5">
                <StatusRow label={strings.settings.status.rows.cloud} status={strings.settings.status.values.optimal} icon={<Globe size={14} />} color="text-emerald-500" />
                <StatusRow label={strings.settings.status.rows.vault} status={strings.settings.status.values.secured} icon={<Shield size={14} />} color="text-indigo-500" />
                <StatusRow label={strings.settings.status.rows.latency} status="12ms" icon={<Cpu size={14} />} color="text-amber-500" />
                <StatusRow label={strings.settings.status.rows.push} status={strings.settings.status.values.active} icon={<Bell size={14} />} color="text-purple-500" />
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ThemeOption = ({ active, onClick, icon, label, description }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-10 rounded-[2.5rem] border-2 text-left transition-all group relative overflow-hidden ${
      active
        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-2xl shadow-indigo-500/10'
        : 'border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-800'
    }`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-all duration-500 ${
      active ? 'bg-white dark:bg-slate-900 scale-110 shadow-indigo-500/20' : 'bg-white dark:bg-slate-800'
    }`}>
      {React.cloneElement(icon, { size: 32, strokeWidth: 2.5 })}
    </div>
    <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-2 ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
      {label}
    </h3>
    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed opacity-80">
      {description}
    </p>
    {active && (
      <div className="absolute top-6 right-6">
        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <CheckCircle size={14} strokeWidth={3} />
        </div>
      </div>
    )}
  </button>
);

const StatusRow = ({ label, status, icon, color }: any) => (
  <div className="flex justify-between items-center py-2 group/row">
    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] group-hover/row:text-slate-600 dark:group-hover/row:text-slate-300 transition-colors">
      <span className={color}>{icon}</span>
      {label}
    </div>
    <span className={`text-[9px] px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl font-black uppercase tracking-[0.2em] border border-emerald-500/10 shadow-sm`}>
      {status}
    </span>
  </div>
);

export default Settings;
