import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import developerPhoto from '../../../Assets/Devloper.jpg';
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
  Moon
} from 'lucide-react';

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');

  const syncProfile = () => {
    const name = localStorage.getItem('user_profile_name') || user?.displayName || 'Krishna Patil Rajput';
    const avatar = localStorage.getItem('user_profile_avatar') || developerPhoto;
    setProfileName(name);
    setProfileAvatar(avatar);
  };

  useEffect(() => {
    syncProfile();
    window.addEventListener('profile_updated', syncProfile);
    return () => window.removeEventListener('profile_updated', syncProfile);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
    { path: '/journal', icon: BookText, label: 'Journal' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/weekly-reflection', icon: Calendar, label: 'Weekly' },
    { path: '/profile', icon: User, label: 'Profile & Logo' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/about', icon: Info, label: 'About Us' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        <div className="p-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Vault size={22} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">MindVault AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card & Theme Toggle Switch */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Interactive Light / Dark Mode Toggle Switch */}
          <div className="px-3 py-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {theme === 'dark' ? <Moon size={14} className="text-amber-400" /> : <Sun size={14} className="text-indigo-600" />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={toggleTheme}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                theme === 'dark' ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              title="Toggle Light / Dark Mode"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500/40 bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
              <img
                src={profileAvatar || developerPhoto}
                alt={profileName}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = developerPhoto;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {profileName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
