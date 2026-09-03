import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CommandPalette from './CommandPalette';
import developerPhoto from '../assets/Devloper.jpg';
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

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const syncProfile = () => {
    const name = localStorage.getItem('user_profile_name') || user?.displayName || 'Reflector';
    const avatar = localStorage.getItem('user_profile_avatar') || developerPhoto;
    setProfileName(name);
    setProfileAvatar(avatar);
  };

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

    return () => {
      window.removeEventListener('profile_updated', syncProfile);
      window.removeEventListener('open_command_palette', handleOpenPalette);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'AI Neural Chat' },
    { path: '/journal', icon: BookText, label: 'Reflections' },
    { path: '/insights', icon: TrendingUp, label: 'Neural Insights' },
    { path: '/weekly-reflection', icon: Calendar, label: 'Weekly Report' },
    { path: '/profile', icon: User, label: 'Profile & Logo' },
    { path: '/settings', icon: Settings, label: 'System Settings' },
    { path: '/about', icon: Info, label: 'About Us' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">
      
      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Cyber Sidebar */}
      <aside className="w-72 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-20 shadow-2xl">
        
        {/* Brand Header */}
        <div className="p-7 pb-4">
          <Link to="/dashboard" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Vault size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-700 dark:from-white dark:via-indigo-200 dark:to-slate-400">
                MindVault
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Core V9.2
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Search Bar Trigger */}
        <div className="px-6 my-3">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-medium transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-indigo-500" />
              <span className="font-semibold">Quick Search...</span>
            </div>
            <kbd className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'group-hover:text-indigo-500 transition-colors'} />
                <span className="tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3.5 w-2 h-2 bg-white rounded-full shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" /> Vault Active
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/50 group hover:border-indigo-500/40 transition-all shadow-sm">
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
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {profileName}
                </p>
                <p className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate uppercase">
                  View Profile
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/30 uppercase tracking-wider"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              MindVault AI
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Clock Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">
              <Zap size={12} className="text-amber-500" />
              <span>{currentTime}</span>
            </div>

            {/* Notification Drawer Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200 dark:border-slate-700/50 relative"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
              </button>

              {/* Dropdown Notification Box */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-500" /> System Updates
                    </span>
                    <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
                        <CheckCircle2 size={14} /> Neural Sync Active
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Your private vault is fully synced with client-side encryption.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Pro Tip: Keyboard Shortcuts</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[9px] font-mono">Ctrl+K</kbd> to launch instant command search anywhere.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-auto relative custom-scrollbar">
          <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
