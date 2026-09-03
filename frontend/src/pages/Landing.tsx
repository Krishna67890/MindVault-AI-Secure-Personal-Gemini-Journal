import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Vault,
  Shield,
  Brain,
  Zap,
  Lock,
  Sparkles,
  Moon,
  Sun,
  ChevronRight,
  ArrowRight,
  Cpu,
  Smile,
  Play,
  Terminal,
  Activity,
  MousePointer2,
  Layers,
  Fingerprint
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { strings } from '../config/strings';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'chat' | 'growth' | 'security'>('chat');
  const [scrolled, setScrolled] = useState(false);

  // Interactive Sandbox state
  const [sandboxInput, setSandboxInput] = useState(strings.landing.sandbox.defaultInput);
  const [sandboxAnalysis, setSandboxAnalysis] = useState({
    mood: strings.landing.sandbox.defaultMood,
    sentimentScore: '92%',
    topics: ['Public Speaking', 'Confidence', 'Work Accomplishment'],
    insight: strings.landing.sandbox.defaultInsight
  });
  const [isAnalyzingSandbox, setIsAnalyzingSandbox] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTestSandbox = () => {
    if (!sandboxInput.trim()) return;
    setIsAnalyzingSandbox(true);
    setTimeout(() => {
      const text = sandboxInput.toLowerCase();
      let mood = 'Reflective';
      let score = '88%';
      let topics = ['Self Growth', 'Mindfulness'];

      if (text.includes('happy') || text.includes('great') || text.includes('confidence') || text.includes('delivered')) {
        mood = 'Optimistic & Empowered';
        score = '95%';
        topics = ['Confidence', 'Achievement', 'Positive Mindset'];
      } else if (text.includes('stress') || text.includes('anxious') || text.includes('hard') || text.includes('tired')) {
        mood = 'Processing Stress';
        score = '74%';
        topics = ['Stress Management', 'Emotional Processing'];
      }

      setSandboxAnalysis({
        mood,
        sentimentScore: score,
        topics,
        insight: `Extracted ${topics.length} cognitive nodes. Pattern indicates active self-awareness.`
      });
      setIsAnalyzingSandbox(false);
    }, 800);
  };

  const [journalDays, setJournalDays] = useState(30);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-700 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-400">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-emerald-600/10 to-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Advanced Cyber Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 py-6 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className={`max-w-7xl mx-auto px-6 h-16 flex justify-between items-center rounded-2xl border transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-white/40 dark:border-slate-800/80 shadow-2xl shadow-indigo-500/10'
            : 'bg-transparent border-transparent'
        }`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Vault size={22} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              {strings.common.appName.split(' ')[0]} <span className="text-indigo-600 dark:text-indigo-400">{strings.common.appName.split(' ')[1]}</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.15em]">
            <a href="#demo" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{strings.nav.demo}</a>
            <a href="#architecture" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{strings.nav.architecture}</a>
            <a href="#security" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{strings.nav.security}</a>
            <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{strings.nav.about}</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-amber-400 hover:scale-110 active:scale-95 transition-all border border-slate-200 dark:border-slate-700/50"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link to="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-4 py-2 hover:text-indigo-600 transition-colors">
              {strings.common.signIn}
            </Link>
            <Link to="/login" className="shimmer-btn bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95">
              {strings.common.enterVault}
            </Link>
          </div>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="relative pt-52 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mb-10 shadow-sm backdrop-blur-md animate-bounce-slow">
            <Sparkles size={14} className="animate-spin-slow text-indigo-500" />
            <span>{strings.landing.hero.badge}</span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black mb-10 leading-[0.95] tracking-tighter text-slate-900 dark:text-white">
            {strings.landing.hero.titleMain} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-400 animate-gradient-x">
              {strings.landing.hero.titleAccent}
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
            {strings.landing.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/login" className="shimmer-btn group bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-base font-black px-10 py-5 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
              {strings.landing.hero.ctaStart} <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            <a href="#demo" className="bg-white dark:bg-slate-900/80 text-slate-900 dark:text-white text-base font-bold px-9 py-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-sm hover:scale-105 active:scale-95">
              <Play size={18} fill="currentColor" className="text-indigo-500" /> {strings.landing.hero.ctaDemo}
            </a>
          </div>

          {/* Neural Metrics Grid */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <MetricBox label={strings.landing.metrics.privacy.label} value={strings.landing.metrics.privacy.value} icon={<Shield className="text-emerald-500" />} />
            <MetricBox label={strings.landing.metrics.models.label} value={strings.landing.metrics.models.value} icon={<Brain className="text-indigo-500" />} />
            <MetricBox label={strings.landing.metrics.latency.label} value={strings.landing.metrics.latency.value} icon={<Zap className="text-amber-500" />} />
            <MetricBox label={strings.landing.metrics.logs.label} value={strings.landing.metrics.logs.value} icon={<Lock className="text-purple-500" />} />
          </div>
        </div>
      </section>

      {/* Advanced Workspace Preview */}
      <section className="py-20 px-4 relative z-10 max-w-7xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/40 dark:border-slate-800/80 rounded-[3rem] p-4 md:p-10 shadow-2xl overflow-hidden">

            {/* Mockup Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 px-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-inner" />
                <span className="ml-5 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:inline-block">
                  {strings.landing.workspace.title}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <WorkspaceTab
                  active={activeTab === 'chat'}
                  onClick={() => setActiveTab('chat')}
                  label={strings.landing.workspace.tabs.chat}
                  icon={<MousePointer2 size={14} />}
                />
                <WorkspaceTab
                  active={activeTab === 'growth'}
                  onClick={() => setActiveTab('growth')}
                  label={strings.landing.workspace.tabs.growth}
                  icon={<Layers size={14} />}
                />
                <WorkspaceTab
                  active={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                  label={strings.landing.workspace.tabs.security}
                  icon={<Fingerprint size={14} />}
                />
              </div>
            </div>

            {/* Content Display Area */}
            <div className="aspect-[21/9] min-h-[500px] bg-slate-950 rounded-[2.5rem] border border-slate-800 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between shadow-inner">
              <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-indigo-600/10 blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[30%] h-[40%] bg-purple-600/10 blur-[100px] pointer-events-none" />

              {activeTab === 'chat' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg">AI</div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{strings.landing.workspace.chat.persona}</p>
                        <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {strings.landing.workspace.chat.status}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                      {strings.landing.workspace.chat.encryption}
                    </span>
                  </div>

                  <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="flex justify-end">
                      <div className="bg-indigo-600/90 backdrop-blur-md text-white px-7 py-4 rounded-[2rem] rounded-tr-none text-sm font-medium max-w-md shadow-xl border border-indigo-400/20 leading-relaxed">
                        "{strings.landing.workspace.chat.mockUser}"
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-200 px-8 py-6 rounded-[2rem] rounded-tl-none text-sm font-medium max-w-2xl space-y-4 shadow-2xl">
                        <p className="leading-relaxed">{strings.landing.workspace.chat.mockAI}</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{strings.landing.workspace.chat.action}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{strings.landing.workspace.chat.actionText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'growth' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex justify-between items-center border-b border-slate-800/50 pb-6">
                    <span className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                      <Activity size={20} className="text-purple-400" /> {strings.landing.workspace.growth.title}
                    </span>
                    <span className="text-[11px] font-mono px-5 py-2 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 font-black">
                      {strings.landing.workspace.growth.score}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GrowthStat label={strings.landing.workspace.growth.awareness} value="92%" color="indigo" />
                    <GrowthStat label={strings.landing.workspace.growth.resilience} value="88%" color="emerald" />
                    <GrowthStat label={strings.landing.workspace.growth.alignment} value="96%" color="purple" />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex justify-between items-center border-b border-slate-800/50 pb-6">
                    <span className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                      <Shield size={20} className="text-emerald-400" /> {strings.landing.workspace.security.title}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-black px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      {strings.landing.workspace.security.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SecurityModule title={strings.landing.workspace.security.storageTitle} desc={strings.landing.workspace.security.storageDesc} />
                    <SecurityModule title={strings.landing.workspace.security.rulesTitle} desc={strings.landing.workspace.security.rulesDesc} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono pt-8 border-t border-slate-800/50 tracking-[0.3em]">
                <span>{strings.landing.workspace.footerLeft}</span>
                <span>{strings.landing.workspace.footerRight}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Neural Sandbox Section */}
      <section id="demo" className="py-32 px-4 relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-5">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 px-5 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 backdrop-blur-sm">
            {strings.landing.sandbox.badge}
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            {strings.landing.sandbox.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto text-base">
            {strings.landing.sandbox.description}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-14 shadow-2xl space-y-10 glow-card group relative">
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <Terminal size={16} className="text-indigo-500" /> {strings.landing.sandbox.label}
            </label>
            <textarea
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTestSandbox}
              disabled={isAnalyzingSandbox}
              className="shimmer-btn bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-indigo-500/20 flex items-center gap-3 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              {isAnalyzingSandbox ? <Cpu size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isAnalyzingSandbox ? strings.landing.sandbox.buttonProcessing : strings.landing.sandbox.buttonAnalyze}
            </button>
          </div>

          {/* Sandbox Live Result Output */}
          <div className="p-8 bg-slate-50 dark:bg-slate-950/80 rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 space-y-8 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
                <Brain size={20} /> {strings.landing.sandbox.resultTitle}
              </span>
              <span className="text-[11px] font-mono px-4 py-2 bg-emerald-500/10 text-emerald-500 font-black rounded-xl border border-emerald-500/20">
                Score: {sandboxAnalysis.sentimentScore}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">{strings.landing.sandbox.detectedMood}</p>
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-black text-xs rounded-2xl border border-indigo-200 dark:border-indigo-900/50 uppercase tracking-widest shadow-sm">
                  <Smile size={16} /> {sandboxAnalysis.mood}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">{strings.landing.sandbox.extractedTopics}</p>
                <div className="flex flex-wrap gap-2.5">
                  {sandboxAnalysis.topics.map(t => (
                    <span key={t} className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm transition-all hover:border-indigo-500/50">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed shadow-sm">
              "{sandboxAnalysis.insight}"
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Growth Projection Slider */}
      <section className="py-24 px-4 bg-[#020617] text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 px-5 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            {strings.landing.calculator.badge}
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">
            {strings.landing.calculator.title}
          </h2>
          <p className="text-slate-400 font-medium text-base max-w-lg mx-auto">
            {strings.landing.calculator.description}
          </p>

          <div className="p-10 md:p-14 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px]" />
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{strings.landing.calculator.label}</span>
                <span className="text-3xl font-black text-indigo-400 tabular-nums">{journalDays} {strings.landing.calculator.unit}</span>
              </div>
              <input
                type="range"
                min="7"
                max="180"
                value={journalDays}
                onChange={(e) => setJournalDays(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all hover:bg-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <ProjectionCard label={strings.landing.calculator.metricEntries} value={`${journalDays}`} icon={<Vault className="text-slate-400" />} />
              <ProjectionCard label={strings.landing.calculator.metricClarity} value={`+${Math.min(Math.round(journalDays * 1.5), 180)}%`} icon={<Activity className="text-emerald-400" />} />
              <ProjectionCard label={strings.landing.calculator.metricStress} value={`-${Math.min(Math.round(journalDays * 0.4), 65)}%`} icon={<Shield className="text-purple-400" />} />
            </div>
          </div>
        </div>
      </section>

      {/* Uncompromising Security Grid */}
      <section id="security" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight">{strings.landing.securitySection.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-lg">
              {strings.landing.securitySection.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {strings.landing.securitySection.cards.map((card, idx) => (
              <SecurityCard
                key={idx}
                icon={idx === 0 ? <Shield /> : idx === 1 ? <Lock /> : <Cpu />}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[4rem] p-12 md:p-24 text-center text-white relative shadow-[0_40px_100px_-20px_rgba(79,70,229,0.5)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 mix-blend-overlay pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] rounded-full bg-white blur-[150px]" />
          </div>
          <Sparkles className="absolute -left-16 -top-16 opacity-10 animate-spin-slow" size={360} />

          <div className="relative z-10 space-y-12">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
              {strings.landing.cta.title.split('?')[0]}<span className="text-indigo-300">?</span>
            </h2>
            <p className="text-indigo-100 font-medium max-w-xl mx-auto text-lg md:text-xl opacity-90">
              {strings.landing.cta.description}
            </p>
            <Link to="/login" className="shimmer-btn inline-flex items-center gap-4 bg-white text-indigo-700 text-lg font-black px-14 py-6 rounded-[2rem] hover:scale-110 transition-all duration-300 shadow-2xl active:scale-95">
              {strings.landing.cta.button} <ChevronRight strokeWidth={4} size={22} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
            <Vault size={20} className="text-indigo-600" />
            <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{strings.common.appName}</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">{strings.landing.footer}</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components with extracted styles ---

const MetricBox = ({ label, value, icon }: any) => (
  <div className="p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[2rem] text-left space-y-2 shadow-sm group hover:border-indigo-500/30 transition-all duration-500 hover:translate-y-[-4px]">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</span>
      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <p className="text-base font-black text-slate-900 dark:text-white leading-tight">{value}</p>
  </div>
);

const WorkspaceTab = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 ${
      active
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/20'
        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
    }`}
  >
    {icon}
    {label}
  </button>
);

const GrowthStat = ({ label, value, color }: any) => (
  <div className="p-6 bg-slate-900 border border-slate-800/50 rounded-3xl group hover:border-indigo-500/30 transition-all">
    <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">{label}</p>
    <p className={`text-4xl font-black text-${color}-400 group-hover:scale-110 transition-transform origin-left`}>{value}</p>
    <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full bg-${color}-500/50 rounded-full w-[${value}] transition-all duration-1000`} />
    </div>
  </div>
);

const SecurityModule = ({ title, desc }: any) => (
  <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 space-y-3 group hover:bg-slate-900 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
      <p className="text-sm font-black text-white uppercase tracking-wider">{title}</p>
    </div>
    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{desc}</p>
  </div>
);

const ProjectionCard = ({ label, value, icon }: any) => (
  <div className="p-6 bg-slate-950/60 rounded-[2rem] border border-white/5 space-y-3 flex flex-col items-center text-center group hover:bg-slate-900 transition-all">
    <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{label}</p>
    <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const SecurityCard = ({ icon, title, description }: any) => (
  <div className="p-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[3rem] space-y-6 hover:border-indigo-500/50 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2">
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
      {React.cloneElement(icon, { size: 32, className: "text-indigo-600 dark:text-indigo-400" })}
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{description}</p>
  </div>
);

export default Landing;
