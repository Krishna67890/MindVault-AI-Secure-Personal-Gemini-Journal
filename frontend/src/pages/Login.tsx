import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Vault, Mail, Lock, Chrome, ArrowRight, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';
import { strings } from '../config/strings';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(strings.login.errors.authFailed);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Ambient Radial Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-emerald-600/10 to-indigo-600/20 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">

        {/* Left Side: Branding/Visuals */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 text-white relative overflow-hidden">
          <Sparkles className="absolute top-10 right-10 opacity-20" size={120} />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3.5 group mb-20">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl group-hover:scale-110 transition-transform">
                <Vault size={24} strokeWidth={2.5} />
              </div>
              <span className="font-black text-2xl tracking-tight">{strings.common.appName.split(' ')[0]}</span>
            </Link>

            <h2 className="text-4xl font-black leading-tight mb-6 tracking-tight">
              {strings.login.branding.title} <br />
              <span className="text-indigo-200">{strings.login.branding.accent}</span>
            </h2>
            <p className="text-indigo-100/80 font-medium leading-relaxed max-w-xs text-sm">
              {strings.login.branding.description}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200/60">
            <ShieldCheck size={16} className="text-emerald-400" /> {strings.login.branding.footer}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-950">
          <div className="mb-8 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? strings.login.form.titleLogin : strings.login.form.titleRegister}
            </h1>
            <p className="text-slate-400 font-medium text-xs">
              {strings.login.form.subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-2 animate-in fade-in">
               <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-ping" />
               <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{strings.login.form.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-600"
                  placeholder={strings.login.form.emailPlaceholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{strings.login.form.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-600"
                  placeholder={strings.login.form.passwordPlaceholder}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-slate-300 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {strings.login.form.submitButton} <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-800" />
              <span className="absolute px-4 bg-slate-950 text-[10px] font-black uppercase tracking-widest text-slate-500">{strings.login.form.ssoSeparator}</span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 group hover:scale-[1.02] active:scale-95"
            >
              <Chrome className="text-white group-hover:rotate-12 transition-transform" size={20} />
              <span>{strings.login.form.googleButton}</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? strings.login.form.toggleRegister : strings.login.form.toggleLogin}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 relative z-10">
         <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={12} /> {strings.login.form.backToLanding}
         </Link>
      </div>
    </div>
  );
};

export default Login;
