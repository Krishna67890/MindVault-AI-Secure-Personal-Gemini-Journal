import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CommandPalette from './CommandPalette';
import developerPhoto from '../assets/Devloper.jpg';
import mindVaultLogo from '../assets/MindVaultAI.png';
import {
  LayoutDashboard,
  MessageSquare,
  BookText,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Vault,
  Info,
  User,
  Sun,
  Moon,
  ChevronRight,
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

import { strings } from '../config/strings';

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const s = strings.layout;

  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('mindvault_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const syncProfile = () => {
    const name = localStorage.getItem('user_profile_name') || user?.displayName || 'Reflector';
    const avatar = localStorage.getItem('user_profile_avatar') || developerPhoto;
    setProfileName(name);
    setProfileAvatar(avatar);
  };

  useEffect(() => {
    localStorage.setItem('mindvault_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    syncProfile();
    window.addEventListener('profile_updated', syncProfile);
    
    const handleOpenPalette = () => setIsCommandOpen(true);
    window.addEventListener('open_command_palette', handleOpenPalette);

    // Live clock update
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    // Advanced Neural Notifications Loop (2m)
    const notificationInterval = setInterval(() => {
      const systemPrompts = [
        "Neural sync complete. Your vault is secure.",
        "Deep reflection suggested: How has your focus evolved today?",
        "New cognitive insight detected in your recent logs.",
        "Equilibrium check: Take a moment for a 60-second mindfulness bridge.",
        "Archiving potential: That recent thought deserves a permanent vault entry.",
        "Neural OS V1 NEUTRAL: System performing at peak empathy levels."
      ];
      const randomPrompt = systemPrompts[Math.floor(Math.random() * systemPrompts.length)];

      const newNotif = {
        id: Date.now(),
        text: randomPrompt,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: Math.random() > 0.5 ? 'insight' : 'system'
      };

      setNotifications(prev => [newNotif, ...prev].slice(0, 5));

      // Also trigger a subtle sound or browser notification if desired
      if (Notification.permission === "granted") {
        new Notification("MindVault AI", { body: randomPrompt, icon: mindVaultLogo });
      }
    }, 120000); // 2 minutes

    // Request notification permission
    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('profile_updated', syncProfile);
      window.removeEventListener('open_command_palette', handleOpenPalette);
      clearInterval(interval);
      clearInterval(notificationInterval);
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: s.nav.dashboard },
    { path: '/chat', icon: MessageSquare, label: s.nav.chat },
    { path: '/journal', icon: BookText, label: s.nav.journal },
    { path: '/insights', icon: TrendingUp, label: s.nav.insights },
    { path: '/weekly-reflection', icon: Calendar, label: s.nav.weekly },
    { path: '/profile', icon: User, label: s.nav.profile },
    { path: '/settings', icon: Settings, label: s.nav.settings },
    { path: '/about', icon: Info, label: s.nav.about },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans relative">
      {/* Advanced Background Elements */}
      <div className="mesh-gradient" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Cyber Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border-r border-slate-200 dark:border-indigo-500/20 flex flex-col shadow-2xl transition-transform duration-300
        lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        
        {/* Brand Header */}
        <div className="p-7 pb-4 relative">
          <div className="flex items-center justify-between lg:block">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-11 h-11 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <img src={mindVaultLogo} alt="MindVault Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-700 dark:from-white dark:via-indigo-200 dark:to-slate-400 neon-text-indigo">
                  MindVault
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {s.sidebar.version}
                </span>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Quick Search Bar Trigger */}
        <div className="px-6 my-3 relative">
          <button
            onClick={() => { setIsCommandOpen(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-indigo-500/20 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-medium transition-all group hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-indigo-500" />
              <span className="font-semibold">{s.sidebar.searchPlaceholder}</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">
              {s.sidebar.kbd}
            </kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar relative py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'group-hover:text-indigo-500 transition-colors'} />
                <span className="tracking-widest">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-indigo-500/10 space-y-3 bg-slate-50/50 dark:bg-slate-950/20 relative">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" /> {s.sidebar.status}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 shadow-md border border-slate-200 dark:border-indigo-500/20 transition-all active:scale-95"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/30 rounded-2xl p-3 border border-slate-200/80 dark:border-indigo-500/20 group hover:border-indigo-500/60 transition-all shadow-lg hover:shadow-indigo-500/5">
            <Link to="/profile" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-500/40 shadow-inner bg-slate-200 flex-shrink-0">
                  <img
                    src={profileAvatar}
                    alt={profileName}
                    className="w-full h-full object-cover"
                    onError={(e: any) => e.target.src = developerPhoto}
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {profileName}
                </p>
                <p className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate uppercase tracking-tighter">
                  {s.sidebar.viewProfile}
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/20 uppercase tracking-[0.2em]"
          >
            <LogOut size={14} />
            {s.sidebar.signOut}
          </button>
        </div>
      </aside>

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Top Header Bar */}
        <header className="h-16 bg-white/40 dark:bg-slate-900/30 backdrop-blur-3xl border-b border-slate-200/80 dark:border-indigo-500/10 px-4 md:px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-500 transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
            <span className="hidden xs:inline text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              {s.header.appName}
            </span>
            <span className="hidden xs:inline text-slate-300 dark:text-slate-800 font-thin">|</span>
            <span className="text-[10px] font-black text-slate-900 dark:text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/5 px-2 md:px-3 py-1 rounded-lg border border-indigo-500/10 truncate max-w-[100px] md:max-w-none">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Clock Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white/50 dark:bg-slate-800/40 backdrop-blur-md rounded-xl text-[10px] font-mono font-bold text-slate-600 dark:text-indigo-300 border border-slate-200 dark:border-indigo-500/20 shadow-sm">
              <Zap size={12} className="text-amber-500 animate-pulse" />
              <span>{currentTime}</span>
            </div>

            {/* Notification Drawer Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-indigo-500/20 relative shadow-sm hover:shadow-indigo-500/10"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>

              {/* Dropdown Notification Box */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-indigo-500/30 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-indigo-500/10">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles size={14} className="text-indigo-500" /> {s.header.updates}
                    </span>
                    <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-2xl border transition-all ${
                          n.type === 'insight'
                            ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20'
                            : 'bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-700/30'
                        }`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${
                              n.type === 'insight' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
                            }`}>
                              {n.type === 'insight' ? <Sparkles size={12} /> : <ShieldCheck size={12} />}
                              {n.type === 'insight' ? 'NEURAL INSIGHT' : 'SYSTEM STATUS'}
                            </div>
                            <span className="text-[8px] font-mono text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{n.text}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase mb-1.5">
                            <CheckCircle2 size={14} /> {s.header.syncActive}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{s.header.syncDesc}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-700/30">
                          <p className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-200 mb-1.5 tracking-wider">{s.header.proTip}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{s.header.proTipDesc.replace('{kbd}', s.sidebar.kbd)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-auto relative custom-scrollbar z-0">
          <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
