import React from 'react';
import { Link } from 'react-router-dom';
import { Vault, Shield, Brain, Zap, Lock, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Vault size={24} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">MindVault AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm py-2 px-4">
            Login
          </Link>
          <Link to="/login" className="btn-primary text-sm px-5 py-2.5 shadow-md">
            Start Journaling
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles size={14} className="text-amber-400 animate-pulse" /> Privacy-First AI Reflection & Personal Vault
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Think. Reflect. <span className="text-indigo-600 dark:text-indigo-400">Understand Yourself.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          MindVault AI is your private, authenticated AI-powered personal journal.
          Talk with Gemini and Claude, reflect on your experiences, and turn conversations
          into a secure journey of personal growth.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="btn-primary text-lg px-8 py-4 shadow-lg">
            Get Started for Free
          </Link>
          <a href="#features" className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-lg border border-slate-200 dark:border-slate-800">
            Explore Features
          </a>
        </div>
      </header>

      {/* Security Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Security & Isolation by Design</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
              Your thoughts are personal. We built MindVault with a zero-trust architecture to ensure your data stays strictly yours.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <SecurityCard
              icon={<Shield className="text-indigo-600 dark:text-indigo-400" />}
              title="Firebase Auth"
              description="Secure authentication using Google Sign-In and industry-standard JWT protocols."
            />
            <SecurityCard
              icon={<Lock className="text-indigo-600 dark:text-indigo-400" />}
              title="Isolated Data"
              description="Cloud Firestore rules ensure every user's data is strictly isolated by verified UID."
            />
            <SecurityCard
              icon={<Brain className="text-indigo-600 dark:text-indigo-400" />}
              title="User-Controlled AI Keys"
              description="Use Gemini and Claude API keys securely with local client key persistence."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Multi-turn AI Journaling</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Have deep, meaningful conversations with Gemini and Claude. Reflect on your day,
                brainstorm ideas, or work through challenges with an AI assistant that helps you find clarity.
              </p>
              <ul className="space-y-4">
                <FeatureItem text="Automatic saving of chat entries into your Journal" />
                <FeatureItem text="Mood and sentiment analysis with growth insights" />
                <FeatureItem text="Automated 7-day Weekly AI Reflection reports" />
              </ul>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-12 aspect-square flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
               <Zap size={100} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">Beyond Simple Journaling</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Advanced features designed to help you visualize your growth over time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-indigo-400">Personal Growth Timeline</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                A visual journey of your life. Our AI identifies meaningful patterns, achievements,
                and recurring challenges across your entries to show you how you've changed.
              </p>
            </div>
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-indigo-400">Weekly AI Reflection Reports</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                Get a high-level summary of your week. Understand your dominant topics,
                growth score, and get suggested focus areas for the week ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
          <p>© 2026 MindVault AI. Built with React + Vite, Firebase, Gemini & Claude AI.</p>
        </div>
      </footer>
    </div>
  );
};

const SecurityCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-semibold">
    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    {text}
  </li>
);

export default Landing;
