import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Camera, Save, CheckCircle, Shield, Sparkles, BookText, MessageSquare, Award, Link as LinkIcon, Heart } from 'lucide-react';
import api from '../services/api';
import developerPhoto from '../../../Assets/Devloper.jpg';

const PRESET_AVATARS = [
  { id: 'developer', name: 'Developer Logo', src: developerPhoto },
  { id: 'avatar1', name: 'Cosmic Reflector', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'avatar2', name: 'AI Explorer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'avatar3', name: 'Mindful Sage', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'avatar4', name: 'Creative Visionary', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stats, setStats] = useState({ entriesCount: 0, convosCount: 0 });

  useEffect(() => {
    // Load profile from localStorage & Auth
    const savedName = localStorage.getItem('user_profile_name') || user?.displayName || 'Krishna Patil Rajput';
    const savedBio = localStorage.getItem('user_profile_bio') || 'Passionate about AI, personal reflection, and software development.';
    const savedAvatar = localStorage.getItem('user_profile_avatar') || developerPhoto;

    setDisplayName(savedName);
    setBio(savedBio);
    setAvatarUrl(savedAvatar);

    // Fetch stats
    api.get('/journals').then(res => setStats(prev => ({ ...prev, entriesCount: res.data?.length || 0 }))).catch(() => {});
    api.get('/chat').then(res => setStats(prev => ({ ...prev, convosCount: res.data?.length || 0 }))).catch(() => {});
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('user_profile_name', displayName.trim());
      localStorage.setItem('user_profile_bio', bio.trim());
      localStorage.setItem('user_profile_avatar', avatarUrl.trim() || developerPhoto);

      // Dispatch custom storage event so Layout/Header update instantly
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
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="text-indigo-600" /> User Profile & Identity
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Customize your name, logo avatar, bio description, and personal vault preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="card space-y-6">
            {savedSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 text-sm font-bold flex items-center gap-2">
                <CheckCircle size={18} />
                Profile updated successfully!
              </div>
            )}

            {/* Avatar Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/40 shadow-xl bg-slate-900 flex items-center justify-center">
                  <img
                    src={avatarUrl || developerPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = developerPhoto;
                    }}
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-transform group-hover:scale-110">
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{displayName || 'User Name'}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{user?.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-sm">{bio}</p>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Bio / Description
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short description about yourself..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Custom Logo / Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(developerPhoto)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
                  >
                    Reset Dev Logo
                  </button>
                </div>
              </div>

              {/* Preset Avatar Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Choose Preset Avatar / Logo
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {PRESET_AVATARS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvatarUrl(item.src || item.url || '')}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-1 ${
                        avatarUrl === (item.src || item.url)
                          ? 'border-indigo-600 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      <img src={item.src || item.url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-sm shadow-md"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Badges */}
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-amber-300">
              <Award size={22} />
              <h3 className="font-bold text-base">Vault Badges</h3>
            </div>

            <div className="space-y-3">
              <BadgeItem icon={<Sparkles size={16} className="text-amber-400" />} title="AI Explorer" sub="Connected Gemini & Claude API" />
              <BadgeItem icon={<BookText size={16} className="text-emerald-400" />} title="Journal Enthusiast" sub={`${stats.entriesCount} entries stored`} />
              <BadgeItem icon={<MessageSquare size={16} className="text-indigo-400" />} title="Mindful Reflector" sub={`${stats.convosCount} AI conversations`} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
              <Shield size={18} className="text-emerald-600" />
              <h3 className="font-bold text-sm">Account Security</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              UID: <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{user?.uid}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Data Isolation Status: <span className="text-emerald-600 font-bold">100% Isolated</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BadgeItem = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/10">
    <div className="p-2 bg-slate-950/40 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs font-bold text-white">{title}</p>
      <p className="text-[10px] text-slate-300">{sub}</p>
    </div>
  </div>
);

export default Profile;
