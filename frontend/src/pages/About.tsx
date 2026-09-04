import React from 'react';
import { Shield, Brain, Zap, Code, Heart, Sparkles, Globe, User, ExternalLink, Github } from 'lucide-react';
import developerPhoto from '../assets/Devloper.jpg';
import mindVaultLogo from '../assets/MindVaultAI.png';
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
      <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-indigo-500/20 shadow-2xl space-y-8 glow-card group">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4 neon-text-indigo">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">
                 <img src={mindVaultLogo} alt="MindVault Logo" className="w-full h-full object-cover" />
              </div>
              {strings.about.mission.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-base">
              {strings.about.mission.description}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-5 w-full">
            <MissionBox icon={<Shield className="text-indigo-500" />} title={strings.about.mission.boxes[0].title} desc={strings.about.mission.boxes[0].desc} />
            <MissionBox icon={<Brain className="text-purple-500" />} title={strings.about.mission.boxes[1].title} desc={strings.about.mission.boxes[1].desc} />
            <MissionBox icon={<Sparkles className="text-amber-500" />} title={strings.about.mission.boxes[2].title} desc={strings.about.mission.boxes[2].desc} />
            <MissionBox icon={<Zap className="text-emerald-500" />} title={strings.about.mission.boxes[3].title} desc={strings.about.mission.boxes[3].desc} />
          </div>
        </div>
      </div>

      {/* Developer Showcase Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center flex items-center justify-center gap-4 uppercase tracking-[0.2em]">
          <User className="text-indigo-600 dark:text-indigo-400" /> {strings.about.architect.title}
        </h2>

        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-14 text-white flex flex-col md:flex-row items-center gap-12 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] pointer-events-none group-hover:bg-indigo-600/30 transition-colors duration-700" />
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative w-48 h-48 overflow-hidden rounded-[2.8rem] shadow-2xl border-4 border-slate-800/80 flex-shrink-0 bg-slate-800 flex items-center justify-center">
              <img
                src={developerPhoto}
                alt={strings.about.architect.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
            <div>
              <h3 className="text-4xl font-black tracking-tight">{strings.about.architect.name}</h3>
              <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2 flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> {strings.about.architect.role}
              </p>
            </div>
            <p className="text-slate-400 leading-relaxed text-base font-medium">
              {strings.about.architect.bio}
            </p>

            {/* Developer Links */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <a
                href={(strings.about.architect as any).portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <ExternalLink size={14} /> Portfolio
              </a>
              <a
                href={(strings.about.architect as any).github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-black/20 border border-slate-700 active:scale-95"
              >
                <Github size={14} /> GitHub
              </a>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
              {strings.about.tech.stack.map((tech, index) => (
                <span key={index} className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl text-[10px] font-black font-mono text-indigo-300 border border-white/10 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-slate-200 dark:border-indigo-500/10 text-center space-y-10 shadow-xl">
        <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">{strings.about.tech.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TechBadge icon={<Code className="text-indigo-500" />} title={strings.about.tech.badges[0]} />
          <TechBadge icon={<Shield className="text-emerald-500" />} title={strings.about.tech.badges[1]} />
          <TechBadge icon={<Sparkles className="text-amber-500" />} title={strings.about.tech.badges[2]} />
          <TechBadge icon={<Globe className="text-purple-500" />} title={strings.about.tech.badges[3]} />
        </div>
      </div>
    </div>
  );
};

const MissionBox = ({ icon, title, desc }: any) => (
  <div className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[2rem] border border-slate-100 dark:border-indigo-500/10 space-y-3 text-center sm:text-left hover:border-indigo-500/40 transition-all group/box shadow-sm hover:shadow-indigo-500/5">
    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg mx-auto sm:mx-0 group-hover/box:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="space-y-1">
      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TechBadge = ({ icon, title }: any) => (
  <div className="flex flex-col items-center justify-center gap-4 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md px-6 py-8 rounded-[2.5rem] shadow-lg border border-slate-200 dark:border-indigo-500/10 hover:border-indigo-500/40 transition-all group/tech">
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover/tech:scale-110 transition-transform shadow-inner">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">{title}</span>
  </div>
);

export default About;
