import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Camera, Save, CheckCircle, Shield, Sparkles, BookText, MessageSquare, Award, Flame, RefreshCw } from 'lucide-react';
import api from '../services/api';
import developerPhoto from '../assets/Devloper.jpg';
import { strings } from '../config/strings';

const PRESET_AVATARS = [
  { id: 'developer', name: strings.profile.presets.developer, src: developerPhoto },
  { id: 'avatar1', name: strings.profile.presets.cosmic, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'avatar2', name: strings.profile.presets.explorer, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'avatar3', name: strings.profile.presets.sage, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'avatar4', name: strings.profile.presets.visionary, url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stats, setStats] = useState({ entriesCount: 0, convosCount: 0 });
  const s = strings.profile;

  useEffect(() => {
    const savedName = localStorage.getItem('user_profile_name') || user?.displayName || s.defaults.name;
    const savedBio = localStorage.getItem('user_profile_bio') || s.defaults.bio;
    const savedAvatar = localStorage.getItem('user_profile_avatar') || developerPhoto;

    setDisplayName(savedName);
    setBio(savedBio);
    setAvatarUrl(savedAvatar);

    api.get('/journals').then(res => setStats(prev => ({ ...prev, entriesCount: res.data?.length || 0 }))).catch(() => {});
    api.get('/chat').then(res => setStats(prev => ({ ...prev, convosCount: res.data?.length || 0 }))).catch(() => {});
  }, [user, s.defaults.name, s.defaults.bio]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('user_profile_name', displayName.trim());
      localStorage.setItem('user_profile_bio', bio.trim());
      localStorage.setItem('user_profile_avatar', avatarUrl.trim() || developerPhoto);

      window.dispatchEvent(new Event('profile_updated'));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-20 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1 px-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 rounded-2xl">
            <UserIcon className="text-indigo-600 w-8 h-8" />
          </div>
          {s.header.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          {s.header.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 glow-card overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

            {savedSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in zoom-in duration-300">
                <CheckCircle size={18} />
                {s.form.success}
              </div>
            )}

            {/* Avatar Header */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800/50">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-500/20 shadow-2xl bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                  <img
                    src={avatarUrl || developerPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = developerPhoto;
                    }}
                  />
                </div>
                <label className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl cursor-pointer shadow-xl transition-all group-hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-950">
                  <Camera size={18} />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{displayName || strings.dashboard.hero.fallbackName}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Shield size={10} /> {user?.email}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 max-w-md">{bio}</p>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {s.form.labels.name}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={s.form.placeholders.name}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {s.form.labels.avatarUrl}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder={s.form.placeholders.avatarUrl}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-6 pr-12 py-4 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(developerPhoto)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                    title={s.form.buttons.reset}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {s.form.labels.bio}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={s.form.placeholders.bio}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Preset Avatar Selection */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                {s.form.labels.presets}
              </label>
              <div className="flex flex-wrap gap-4">
                {PRESET_AVATARS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatarUrl(item.src || item.url || '')}
                    className={`group relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all p-1.5 ${
                      avatarUrl === (item.src || item.url)
                        ? 'border-indigo-600 scale-110 shadow-xl bg-indigo-600/5'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-transparent'
                    }`}
                  >
                    <img src={item.src || item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="shimmer-btn bg-indigo-600 text-white flex items-center gap-3 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? s.form.buttons.saving : s.form.buttons.save}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements Card */}
          <div className="bg-slate-900 dark:bg-indigo-950/20 text-white rounded-[2.5rem] p-8 border border-slate-800 dark:border-indigo-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 text-amber-300">
                <div className="p-2 bg-amber-400/10 rounded-xl">
                  <Award size={24} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-[0.2em]">{s.sidebar.achievements}</h3>
              </div>

              <div className="space-y-4">
                <BadgeItem
                  icon={<Sparkles size={16} className="text-amber-400" />}
                  title={s.badges.explorer.title}
                  sub={s.badges.explorer.sub}
                />
                <BadgeItem
                  icon={<BookText size={16} className="text-emerald-400" />}
                  title={s.badges.writer.title}
                  sub={s.badges.writer.sub.replace('{count}', stats.entriesCount.toString())}
                />
                <BadgeItem
                  icon={<MessageSquare size={16} className="text-indigo-400" />}
                  title={s.badges.pioneer.title}
                  sub={s.badges.pioneer.sub.replace('{count}', stats.convosCount.toString())}
                />
                <BadgeItem
                  icon={<Flame size={16} className="text-red-400" />}
                  title={s.badges.streak.title}
                  sub={s.badges.streak.sub}
                />
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Shield size={20} className="text-emerald-500" />
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">{s.sidebar.security}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{s.sidebar.uid}</p>
                <div className="font-mono text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-300 break-all">
                  {user?.uid}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{s.sidebar.isolation}</p>
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-500/5 w-fit px-3 py-1.5 rounded-full border border-emerald-500/10">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {s.sidebar.encrypted}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BadgeItem = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.08] group">
    <div className="p-3 bg-slate-950/60 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">{icon}</div>
    <div className="space-y-0.5">
      <p className="text-xs font-black text-white tracking-wide">{title}</p>
      <p className="text-[10px] text-slate-400 font-bold tracking-tight">{sub}</p>
    </div>
  </div>
);

export default Profile;

