import React from 'react';
import { Shield, Brain, Zap, Code, Heart, Sparkles, Globe, User } from 'lucide-react';
import developerPhoto from '../../../Assets/Devloper.jpg';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
          About <span className="text-indigo-600">MindVault AI</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Your thoughts are personal. Your growth should be intelligent.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="text-red-500" /> Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              MindVault AI is a privacy-first AI journaling platform designed to help people understand their thoughts,
              reflect on their experiences, and grow personally with the power of Gemini and Claude AI models.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We combine AI, secure cloud technology, and personal journaling to transform everyday thoughts into
              meaningful insights.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-2xl flex flex-col items-center text-center space-y-2">
              <Shield className="text-indigo-600" />
              <span className="text-sm font-semibold">Privacy First</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl flex flex-col items-center text-center space-y-2">
              <Brain className="text-emerald-600" />
              <span className="text-sm font-semibold">AI Insights</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl flex flex-col items-center text-center space-y-2">
              <Sparkles className="text-amber-600" />
              <span className="text-sm font-semibold">Self Growth</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl flex flex-col items-center text-center space-y-2">
              <Zap className="text-blue-600" />
              <span className="text-sm font-semibold">Fast & Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center flex items-center justify-center gap-2">
          <User className="text-indigo-600" /> Meet the Developer
        </h2>
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="w-36 h-36 overflow-hidden rounded-full shadow-2xl border-4 border-indigo-500/50 flex-shrink-0 bg-slate-800 flex items-center justify-center">
            <img
              src={developerPhoto}
              alt="Krishna Patil Rajput"
              className="w-full h-full object-cover"
              onError={(e: any) => {
                // Fallback if image path fails
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold">Krishna Patil Rajput</h3>
              <p className="text-indigo-400 font-semibold text-sm">Full-Stack Web Developer • AI Enthusiast</p>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              Passionate about building innovative applications that combine AI, modern web development,
              and secure software architecture for personal growth and productivity.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-indigo-300 border border-slate-700">React + Vite</span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-emerald-300 border border-slate-700">Firebase</span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-amber-300 border border-slate-700">Gemini</span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-blue-300 border border-slate-700">Google Cloud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="text-center space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900">Built With Modern Tech</h2>
        <div className="flex flex-wrap justify-center gap-8 font-bold text-slate-700">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"><Code size={20} className="text-indigo-600"/> React + Vite</div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"><Shield size={20} className="text-amber-500"/> Firebase</div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"><Sparkles size={20} className="text-purple-600"/> Gemini</div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"><Globe size={20} className="text-blue-600"/> Google Cloud</div>
        </div>
      </div>
    </div>
  );
};

export default About;
