import React from 'react';
import { Shield, Brain, Zap, Code, Heart, Sparkles, Globe, User } from 'lucide-react';
import developerPhoto from '../assets/Devloper.jpg';
import { strings } from '../config/strings';

const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 font-sans">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
          <Sparkles size={12} /> {strings.about.hero.tag}
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {strings.about.hero.title.split(' ')[0]} {strings.about.hero.title.split(' ')[1]} <span className="text-indigo-600 dark:text-indigo-400">{strings.about.hero.title.split(' ')[2]} {strings.about.hero.title.split(' ')[3]}</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          {strings.about.hero.description}
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-8 glow-card">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Heart className="text-red-500" /> {strings.about.mission.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm">
              {strings.about.mission.description1}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm">
              {strings.about.mission.description2}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <MissionBox icon={<Shield className="text-indigo-500" />} title={strings.about.mission.boxes[0].title} desc={strings.about.mission.boxes[0].desc} />
            <MissionBox icon={<Brain className="text-purple-500" />} title={strings.about.mission.boxes[1].title} desc={strings.about.mission.boxes[1].desc} />
            <MissionBox icon={<Sparkles className="text-amber-500" />} title={strings.about.mission.boxes[2].title} desc={strings.about.mission.boxes[2].desc} />
            <MissionBox icon={<Zap className="text-emerald-500" />} title={strings.about.mission.boxes[3].title} desc={strings.about.mission.boxes[3].desc} />
          </div>
        </div>
      </div>

      {/* Developer Showcase Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center flex items-center justify-center gap-3">
          <User className="text-indigo-600 dark:text-indigo-400" /> {strings.about.architect.title}
        </h2>

        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[80px] pointer-events-none" />
          
          <div className="w-40 h-40 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-indigo-500/40 flex-shrink-0 bg-slate-800 flex items-center justify-center">
            <img
              src={developerPhoto}
              alt={strings.about.architect.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
            <div>
              <h3 className="text-3xl font-black">{strings.about.architect.name}</h3>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mt-1">{strings.about.architect.role}</p>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm font-medium">
              {strings.about.architect.bio}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
              <span className="px-3.5 py-1.5 bg-white/10 rounded-xl text-xs font-mono font-bold text-indigo-300 border border-white/10">React 18 + Vite</span>
              <span className="px-3.5 py-1.5 bg-white/10 rounded-xl text-xs font-mono font-bold text-emerald-300 border border-white/10">Firebase Firestore</span>
              <span className="px-3.5 py-1.5 bg-white/10 rounded-xl text-xs font-mono font-bold text-amber-300 border border-white/10">Google Gemini Pro</span>
              <span className="px-3.5 py-1.5 bg-white/10 rounded-xl text-xs font-mono font-bold text-purple-300 border border-white/10">TailwindCSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="bg-slate-100 dark:bg-slate-900/60 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 text-center space-y-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{strings.about.tech.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-bold text-slate-700 dark:text-slate-300 text-xs">
          <TechBadge icon={<Code className="text-indigo-500" />} title="React + Vite" />
          <TechBadge icon={<Shield className="text-emerald-500" />} title="Firebase Auth" />
          <TechBadge icon={<Sparkles className="text-amber-500" />} title="Gemini Pro" />
          <TechBadge icon={<Globe className="text-purple-500" />} title="Google Cloud" />
        </div>
      </div>
    </div>
  );
};

const MissionBox = ({ icon, title, desc }: any) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-center sm:text-left">
    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mx-auto sm:mx-0">
      {icon}
    </div>
    <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{title}</p>
    <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
  </div>
);

const TechBadge = ({ icon, title }: any) => (
  <div className="flex items-center justify-center gap-2.5 bg-white dark:bg-slate-950 px-5 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
    {icon} <span>{title}</span>
  </div>
);

export default About;
