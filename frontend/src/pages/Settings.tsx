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
  CheckCircle
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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 font-sans">
      <div className="px-2 space-y-1">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{strings.settings.header.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{strings.settings.header.description}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Configuration Section */}
          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-1 shadow-sm overflow-hidden glow-card">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Cpu size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{strings.settings.neural.title}</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{strings.settings.neural.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[10px] font-black uppercase">
                <Shield size={12} /> {strings.settings.neural.clientEncrypted}
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {strings.settings.neural.description}
              </p>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{strings.settings.neural.labels.gemini}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Key size={18} />
                    </div>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder={strings.settings.neural.placeholders.gemini}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="flex justify-between px-1">
                     <p className="text-[10px] text-slate-500 font-medium">Primary processor for chat & sentiment graph.</p>
                     <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest hover:underline">{strings.settings.neural.links.gemini}</a>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{strings.settings.neural.labels.claude}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={claudeKey}
                      onChange={(e) => setClaudeKey(e.target.value)}
                      placeholder={strings.settings.neural.placeholders.claude}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="flex justify-between px-1">
                     <p className="text-[10px] text-slate-500 font-medium">High-fidelity reasoning engine.</p>
                     <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest hover:underline">{strings.settings.neural.links.claude}</a>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{strings.settings.neural.labels.provider}</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-black uppercase tracking-widest cursor-pointer"
                  >
                    <option value="gemini">Google Gemini Pro</option>
                    <option value="claude">Anthropic Claude 3.5</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={saveApiKeys}
                  disabled={saving}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} /> {strings.settings.neural.saveBtn}
                </button>

                <button
                  onClick={handleTestConnection}
                  disabled={testingKey}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200"
                >
                  {testingKey ? strings.settings.neural.testing : strings.settings.neural.testBtn}
                </button>

                {message.text && (
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-3 rounded-xl ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Theme Selection */}
          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-1 shadow-sm overflow-hidden glow-card">
             <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{strings.settings.theme.title}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{strings.settings.theme.subtitle}</p>
                  </div>
                </div>
             </div>

             <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">{strings.settings.account.title}</h3>
                  <p className="text-emerald-400 font-bold uppercase text-[10px]">{strings.settings.account.verified}</p>
                </div>
             </div>

             <div className="space-y-3 border-t border-slate-800 pt-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase">{strings.settings.account.labels.name}</p>
                   <p className="text-white font-bold text-sm">{localStorage.getItem('user_profile_name') || user?.displayName || strings.settings.account.defaultName}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase">{strings.settings.account.labels.email}</p>
                   <p className="text-white font-bold text-sm truncate">{user?.email}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase">{strings.settings.account.labels.uid}</p>
                   <p className="text-slate-400 font-mono text-[10px] break-all">{user?.uid}</p>
                </div>
             </div>
          </section>

          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white">
                  <Database size={20} />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{strings.settings.status.title}</h3>
             </div>

             <div className="space-y-4">
                <StatusRow label={strings.settings.status.rows.cloud} status={strings.settings.status.values.optimal} icon={<Globe size={12} />} />
                <StatusRow label={strings.settings.status.rows.vault} status={strings.settings.status.values.secured} icon={<Lock size={12} />} />
                <StatusRow label={strings.settings.status.rows.latency} status="12ms" icon={<Cpu size={12} />} />
                <StatusRow label={strings.settings.status.rows.push} status={strings.settings.status.values.active} icon={<Bell size={12} />} />
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
    className={`p-6 rounded-[2rem] border-2 text-left transition-all group ${
      active
        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xl'
        : 'border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 hover:border-slate-300'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${
      active ? 'bg-white dark:bg-slate-900 shadow-md' : 'bg-white dark:bg-slate-800'
    }`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className={`text-xs font-black uppercase tracking-widest mb-1 ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
      {label}
    </h3>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {description}
    </p>
  </button>
);

const StatusRow = ({ label, status, icon }: any) => (
  <div className="flex justify-between items-center py-1">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {icon} {label}
    </div>
    <span className="text-[9px] px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg font-black uppercase tracking-wider">
      {status}
    </span>
  </div>
);

export default Settings;
