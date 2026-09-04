import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  Loader2,
  User,
  Bot,
  BookPlus,
  CheckCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Search,
  Sliders,
  ShieldCheck,
  Flame,
  Brain,
  Clock,
  X,
  Zap,
  Cpu
} from 'lucide-react';
import api from '../services/api';
import ApiKeyBanner from '../components/ApiKeyBanner';
import { strings } from '../config/strings';
import { MindVaultAIEngine } from '../services/MindVaultAIEngine';
import { JournalStore } from '../services/journalStore';
import { ChatStore, Conversation, Message } from '../services/chatStore';

const PERSONAS = [
  { id: 'inbuilt', name: strings.chat.personas[0].name, desc: strings.chat.personas[0].desc, icon: User, color: 'text-rose-500' },
  { id: 'listener', name: strings.chat.personas[1].name, desc: strings.chat.personas[1].desc, icon: Bot, color: 'text-indigo-500' },
  { id: 'coach', name: strings.chat.personas[2].name, desc: strings.chat.personas[2].desc, icon: Brain, color: 'text-purple-500' },
  { id: 'socratic', name: strings.chat.personas[3].name, desc: strings.chat.personas[3].desc, icon: Sparkles, color: 'text-amber-500' },
  { id: 'zen', name: strings.chat.personas[4].name, desc: strings.chat.personas[4].desc, icon: Flame, color: 'text-emerald-500' },
];

const PROVIDERS = [
  { id: 'inbuilt', name: 'MindVault AI (Free)', desc: '100% Free & Standalone Human Empathy Engine', icon: Sparkles, color: 'text-rose-400' },
  { id: 'gemini', name: 'Gemini 1.5 Flash', desc: 'Google High-Speed Cloud Reasoning', icon: Zap, color: 'text-indigo-400' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', desc: 'Anthropic Deep Intuitive Cognition', icon: Cpu, color: 'text-amber-400' }
];

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('inbuilt');
  const [activeProvider, setActiveProvider] = useState<string>('inbuilt');
  const [searchHistory, setSearchHistory] = useState('');
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProvider = localStorage.getItem('user_preferred_ai_provider') || 'inbuilt';
    setActiveProvider(savedProvider);
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeProvider = (newProvider: string) => {
    setActiveProvider(newProvider);
    localStorage.setItem('user_preferred_ai_provider', newProvider);
  };

  const fetchConversations = async () => {
    try {
      setListLoading(true);
      const convos = await ChatStore.getConversations();
      setConversations(convos);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setListLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentConvoId(null);
    setMessages([]);
    setInput('');
  };

  const selectConversation = async (id: string) => {
    try {
      setLoading(true);
      const convo = await ChatStore.getConversation(id);
      setCurrentConvoId(id);
      setMessages(convo?.messages || []);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Failed to select conversation', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToJournal = async (titleText: string, contentText: string) => {
    try {
      await JournalStore.saveEntry({
        title: titleText || strings.chat.interface.defaultTitle,
        content: contentText,
        mood: 'Reflective',
        tags: ['ai-chat', 'saved-insight'],
        analysis: null
      });
      setSaveStatus(strings.chat.saveStatus);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save chat to journal', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
    const personaObj = PERSONAS.find(p => p.id === selectedPersona);
    const personaPromptPrefix = `[Persona: ${personaObj?.name}] `;

    const userMessage: Message = {
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      let aiResponseText = '';
      const userGeminiKey = localStorage.getItem('user_gemini_api_key');
      const userClaudeKey = localStorage.getItem('user_claude_api_key');

      // Determine routing based on selected activeProvider
      if (activeProvider === 'gemini') {
        if (!userGeminiKey) {
          aiResponseText = `⚠️ **Gemini API Key Required**\n\nYou switched to **Google Gemini 1.5 Flash**, but no Gemini API key was found in your vault settings.\n\nTo use Gemini AI, please enter your Gemini API key in **Settings** or the top banner.\n\n*Alternatively, click **MindVault AI (Free)** in the top bar to continue chatting for 100% free without any API key!*`;
        } else {
          try {
            const res = await api.post('/chat', {
              conversationId: currentConvoId,
              message: personaPromptPrefix + userMsgText,
              history: messages,
              provider: 'gemini'
            });
            aiResponseText = res.data.response;
          } catch (err: any) {
            aiResponseText = `⚠️ **Gemini API Connection Failed**\n\nUnable to reach Gemini cloud service: ${err?.response?.data?.error || err.message}.\n\nPlease check your Gemini API key in Settings, or switch to **MindVault AI (Free)**.`;
          }
        }
      } else if (activeProvider === 'claude') {
        if (!userClaudeKey) {
          aiResponseText = `⚠️ **Claude API Key Required**\n\nYou switched to **Anthropic Claude 3.5 Sonnet**, but no Claude API key was found in your vault settings.\n\nTo use Claude AI, please enter your Claude API key in **Settings** or the top banner.\n\n*Alternatively, click **MindVault AI (Free)** in the top bar to continue chatting for 100% free without any API key!*`;
        } else {
          try {
            const res = await api.post('/chat', {
              conversationId: currentConvoId,
              message: personaPromptPrefix + userMsgText,
              history: messages,
              provider: 'claude'
            });
            aiResponseText = res.data.response;
          } catch (err: any) {
            aiResponseText = `⚠️ **Claude API Connection Failed**\n\nUnable to reach Claude cloud service: ${err?.response?.data?.error || err.message}.\n\nPlease check your Claude API key in Settings, or switch to **MindVault AI (Free)**.`;
          }
        }
      } else {
        // Standalone Free MindVault Human AI Engine
        aiResponseText = await MindVaultAIEngine.generateResponse(userMsgText, {
          persona: selectedPersona,
          history: messages
        });
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save & Update Conversation Session History
      const sessionConvoId = currentConvoId || 'convo_' + Date.now();
      const existingConvo = conversations.find(c => c.id === sessionConvoId);
      const convoTitle = existingConvo?.title || (userMsgText.length > 30 ? userMsgText.substring(0, 30) + '...' : userMsgText);

      await ChatStore.saveConversation({
        id: sessionConvoId,
        title: convoTitle,
        updatedAt: new Date().toISOString(),
        messages: finalMessages
      });

      if (!currentConvoId) {
        setCurrentConvoId(sessionConvoId);
      }

      fetchConversations();

      // Auto-Vault Insight to Journal
      await JournalStore.saveEntry({
        title: `Chat Insight: ${userMsgText.substring(0, 30)}...`,
        content: `User: ${userMsgText}\n\nAI Response: ${aiResponseText}`,
        mood: 'Reflective',
        tags: ['ai-chat', activeProvider],
        analysis: null
      });

      setSaveStatus(strings.chat.autoVaultStatus);
      setTimeout(() => setSaveStatus(''), 3500);

    } catch (error: any) {
      console.error('Chat error:', error);
      const fallbackResponse = await MindVaultAIEngine.generateResponse(userMsgText, { persona: selectedPersona });
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const speakMessage = (index: number, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingIdx === index) {
        window.speechSynthesis.cancel();
        setSpeakingIdx(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const deleteConvo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(strings.chat.sidebar.deleteConfirm)) return;
    try {
      await ChatStore.deleteConversation(id);
      if (currentConvoId === id) startNewChat();
      fetchConversations();
    } catch (error) {
      console.error('Failed to delete conversation', error);
    }
  };

  const filteredConversations = conversations.filter(c =>
    (c.title || '').toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-9.5rem)] space-y-4 md:space-y-6 font-sans animate-in fade-in duration-700">
      <ApiKeyBanner onKeySaved={fetchConversations} />

      {saveStatus && (
        <div className="fixed top-20 md:top-24 right-4 md:right-8 z-50 bg-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-[2rem] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-in slide-in-from-right-8 duration-500">
          <CheckCircle size={18} strokeWidth={3} />
          {saveStatus}
        </div>
      )}

      <div className="flex-1 flex bg-white dark:bg-slate-950/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none" />
        
        {/* Mobile History Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat History Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-slate-950 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-slate-50/30 md:dark:bg-slate-950/60 md:backdrop-blur-md md:border-r md:border-slate-200 md:dark:border-slate-800/80
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <div className="p-6 space-y-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between md:hidden mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">History</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400"><X size={20} /></button>
            </div>
            <button
              onClick={() => { startNewChat(); setIsSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all shimmer-btn"
            >
              <Plus size={18} strokeWidth={3} />
              {strings.chat.sidebar.newChat}
            </button>

            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder={strings.chat.sidebar.searchPlaceholder}
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{strings.chat.sidebar.historyTitle}</h3>
            <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">{conversations.length} Sessions</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
            {listLoading ? (
              <div className="flex flex-col items-center justify-center py-16 opacity-40 space-y-4">
                <Loader2 size={28} className="animate-spin text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{strings.chat.sidebar.loadingHistory}</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-20 text-center space-y-3 px-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600">
                  <MessageSquare size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{strings.chat.sidebar.noSessions}</p>
              </div>
            ) : (
              filteredConversations.map(convo => (
                <div
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    currentConvoId === convo.id
                      ? 'bg-white dark:bg-slate-800 shadow-xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 ring-1 ring-indigo-500/20'
                      : 'hover:bg-white/60 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 truncate pr-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      currentConvoId === convo.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500'
                    }`}>
                      <MessageSquare size={18} />
                    </div>
                    <div className="truncate space-y-0.5">
                      <p className={`text-[11px] font-black truncate uppercase tracking-wider ${currentConvoId === convo.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {convo.title || strings.chat.sidebar.untitledSession}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                        {convo.updatedAt ? new Date(convo.updatedAt?._seconds ? convo.updatedAt._seconds * 1000 : convo.updatedAt).toLocaleDateString() : 'Recent Session'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteConvo(convo.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Interface Area */}
        <div className="flex-1 flex flex-col bg-transparent relative min-w-0 z-10">
          
          {/* Model Provider & Persona Control Bar */}
          <div className="px-4 md:px-8 py-3 md:py-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md">
             
             {/* Model Provider Selector */}
             <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-hide">
               <button
                 onClick={() => setIsSidebarOpen(true)}
                 className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"
               >
                 <MessageSquare size={18} />
               </button>

               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-1 hidden lg:inline">Engine:</span>
               
               {PROVIDERS.map(p => {
                 const Icon = p.icon;
                 const isSel = activeProvider === p.id;
                 return (
                   <button
                     key={p.id}
                     onClick={() => changeProvider(p.id)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                       isSel
                         ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg scale-105 ring-2 ring-indigo-500/50'
                         : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                     }`}
                     title={p.desc}
                   >
                     <Icon size={12} className={isSel ? 'text-indigo-400' : p.color} />
                     <span>{p.name}</span>
                   </button>
                 );
               })}
             </div>

             {/* Personas Selector */}
             <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-hide">
               {PERSONAS.map(p => {
                 const Icon = p.icon;
                 const isSel = selectedPersona === p.id;
                 return (
                   <button
                     key={p.id}
                     onClick={() => setSelectedPersona(p.id)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                       isSel
                         ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                         : 'bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                     }`}
                     title={p.desc}
                   >
                     <Icon size={11} className={isSel ? 'text-white' : p.color} />
                     <span>{p.name}</span>
                   </button>
                 );
               })}
             </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-10 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 md:px-10">
                <div className="relative mb-6 md:mb-10">
                  <div className="absolute inset-0 bg-indigo-600/20 blur-[40px] md:blur-[60px] animate-pulse rounded-full" />
                  <div className="relative w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 animate-float">
                    <Sparkles size={32} strokeWidth={2.5} className="md:w-11 md:h-11" />
                  </div>
                </div>
                <div className="max-w-md space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                    {strings.chat.interface.emptyState.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[9px] md:text-xs font-bold leading-relaxed uppercase tracking-wider opacity-70">
                    Active Engine: <span className="text-indigo-500 uppercase">{PROVIDERS.find(p => p.id === activeProvider)?.name}</span> • Ready for full multi-turn conversation.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                  <div className={`flex gap-3 md:gap-5 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl transition-transform hover:scale-110 ${
                      msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black' : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-600/20'
                    }`}>
                      {msg.role === 'user' ? <User size={18} className="md:w-6 md:h-6" /> : <Bot size={18} className="md:w-6 md:h-6" />}
                    </div>
                    
                    <div className={`space-y-2 md:space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] text-xs md:text-base font-medium leading-[1.6] md:leading-[1.7] shadow-sm selection:bg-indigo-500/30 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10'
                          : 'bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm'
                      }`}>
                        {msg.content}
                      </div>

                      {/* Action Bar for Assistant Messages */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 md:gap-3 pt-1 px-1 md:px-2">
                          <button
                            onClick={() => saveToJournal(`Reflected Insight (${new Date().toLocaleDateString()})`, msg.content)}
                            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] rounded-lg md:rounded-xl transition-all border border-indigo-500/20"
                          >
                            <BookPlus size={10} className="md:w-3 md:h-3" />
                            <span className="hidden xs:inline">{strings.chat.interface.actions.archive}</span>
                            <span className="xs:hidden">SAVE</span>
                          </button>
                          
                          <button
                            onClick={() => speakMessage(idx, msg.content)}
                            className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl text-[10px] transition-all border ${
                              speakingIdx === idx ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {speakingIdx === idx ? <VolumeX size={12} className="md:w-3.5 md:h-3.5" /> : <Volume2 size={12} className="md:w-3.5 md:h-3.5" />}
                          </button>

                          <button
                            onClick={() => copyToClipboard(idx, msg.content)}
                            className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all"
                          >
                            {copiedIdx === idx ? <Check size={12} className="text-emerald-500 md:w-3.5 md:h-3.5" /> : <Copy size={12} className="md:w-3.5 md:h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3 md:gap-5 max-w-[80%]">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/20 animate-pulse">
                    <Bot size={18} className="md:w-6 md:h-6" />
                  </div>
                  <div className="px-5 py-3 md:px-8 md:py-5 rounded-xl md:rounded-[2rem] bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 rounded-tl-none shadow-sm flex items-center gap-2 md:gap-3 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Console */}
          <div className="p-4 md:p-8 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={strings.chat.interface.inputPlaceholder}
                disabled={loading}
                className="w-full pl-6 md:pl-8 pr-16 md:pr-20 py-4 md:py-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] text-xs md:text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-3 md:right-4 p-3 md:p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl md:rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
              >
                {loading ? <Loader2 size={18} className="animate-spin md:w-5 md:h-5" /> : <Send size={18} className="md:w-5 md:h-5" />}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
