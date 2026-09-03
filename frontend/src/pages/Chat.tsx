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
  Clock
} from 'lucide-react';
import api from '../services/api';
import ApiKeyBanner from '../components/ApiKeyBanner';
import { strings } from '../config/strings';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: any;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: any;
  messages: Message[];
}

const PERSONAS = [
  { id: 'listener', name: strings.chat.personas[0].name, desc: strings.chat.personas[0].desc, icon: Bot, color: 'text-indigo-500' },
  { id: 'coach', name: strings.chat.personas[1].name, desc: strings.chat.personas[1].desc, icon: Brain, color: 'text-purple-500' },
  { id: 'socratic', name: strings.chat.personas[2].name, desc: strings.chat.personas[2].desc, icon: Sparkles, color: 'text-amber-500' },
  { id: 'zen', name: strings.chat.personas[3].name, desc: strings.chat.personas[3].desc, icon: Flame, color: 'text-emerald-500' },
];

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('listener');
  const [searchHistory, setSearchHistory] = useState('');
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setListLoading(true);
      const res = await api.get('/chat');
      setConversations(res.data || []);
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
      const res = await api.get(`/chat/${id}`);
      setCurrentConvoId(id);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch conversation', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToJournal = async (titleText: string, contentText: string) => {
    try {
      await api.post('/journals', {
        title: titleText || strings.chat.interface.defaultTitle,
        content: contentText,
        mood: 'Reflective',
        tags: ['ai-chat', 'saved-insight']
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
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        conversationId: currentConvoId,
        message: personaPromptPrefix + userMsgText,
        history: messages,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (res.data.savedToJournal) {
        setSaveStatus(strings.chat.autoVaultStatus);
        setTimeout(() => setSaveStatus(''), 3500);
      }

      if (!currentConvoId && res.data.conversationId) {
        setCurrentConvoId(res.data.conversationId);
        fetchConversations();
      }
    } catch (error: any) {
      console.error('Failed to send message', error);
      const errorMessage = error?.response?.data?.error || strings.chat.errorPrefix;
      alert(errorMessage);
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
      await api.delete(`/chat/${id}`);
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
    <div className="flex flex-col h-[calc(100vh-9.5rem)] space-y-4 font-sans">
      <ApiKeyBanner onKeySaved={fetchConversations} />

      {saveStatus && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2.5 shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-right">
          <CheckCircle size={18} strokeWidth={3} />
          {saveStatus}
        </div>
      )}

      <div className="flex-1 flex bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {/* Chat History Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800/80 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-5 space-y-3 border-b border-slate-100 dark:border-slate-800/80">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus size={18} strokeWidth={3} />
              {strings.chat.sidebar.newChat}
            </button>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={strings.chat.sidebar.searchPlaceholder}
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="px-5 py-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{strings.chat.sidebar.historyTitle}</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5 custom-scrollbar">
            {listLoading ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-40 space-y-2">
                <Loader2 size={22} className="animate-spin text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">{strings.chat.sidebar.loadingHistory}</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs font-bold">{strings.chat.sidebar.noSessions}</div>
            ) : (
              filteredConversations.map(convo => (
                <div
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`group relative flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                    currentConvoId === convo.id
                      ? 'bg-white dark:bg-slate-800 shadow-lg shadow-indigo-500/10 border border-slate-200 dark:border-slate-700'
                      : 'hover:bg-white/60 dark:hover:bg-slate-800/40 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      currentConvoId === convo.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      <MessageSquare size={16} />
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-black truncate ${currentConvoId === convo.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {convo.title || strings.chat.sidebar.untitledSession}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteConvo(convo.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Interface Area */}
        <div className="flex-1 flex flex-col bg-transparent relative min-w-0">
          
          {/* Top Persona Bar */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-white/40 dark:bg-slate-950/40">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">{strings.chat.interface.personaLabel}</span>
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                  {PERSONAS.map(p => {
                    const Icon = p.icon;
                    const isSel = selectedPersona === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersona(p.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          isSel
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={p.desc}
                      >
                        <Icon size={14} className={isSel ? 'text-white' : p.color} />
                        <span>{p.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> {strings.chat.interface.clientEncrypted}
             </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 mb-6 animate-bounce-slow">
                  <Sparkles size={36} strokeWidth={2.5} />
                </div>
                <div className="max-w-md space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {strings.chat.interface.emptyState.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                    {strings.chat.interface.emptyState.description}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
                      msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold' : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    
                    <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700'
                      }`}>
                        {msg.content}
                      </div>

                      {/* Action Bar for Assistant Messages */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => saveToJournal(`Reflected Insight (${new Date().toLocaleDateString()})`, msg.content)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                          >
                            <BookPlus size={12} /> {strings.chat.interface.actions.archive}
                          </button>
                          
                          <button
                            onClick={() => speakMessage(idx, msg.content)}
                            className={`p-1.5 rounded-lg text-[10px] transition-all ${
                              speakingIdx === idx ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700'
                            }`}
                            title={strings.chat.interface.actions.speak}
                          >
                            {speakingIdx === idx ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          </button>

                          <button
                            onClick={() => copyToClipboard(idx, msg.content)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[10px] transition-all"
                            title={strings.chat.interface.actions.copy}
                          >
                            {copiedIdx === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Bot size={18} />
                  </div>
                  <div className="px-5 py-3.5 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Console */}
          <div className="p-6 bg-gradient-to-t from-white dark:from-slate-900 via-white dark:via-slate-900 to-transparent">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
              <div className="relative flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-2 pl-5 rounded-[2rem] shadow-2xl focus-within:border-indigo-500">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={strings.chat.interface.inputPlaceholder}
                  className="flex-1 bg-transparent py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-32"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white w-12 h-12 rounded-[1.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
