import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, MessageSquare, Trash2, Loader2, User, Bot, BookPlus, CheckCircle } from 'lucide-react';
import api from '../services/api';
import ApiKeyBanner from '../components/ApiKeyBanner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: any;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: any;
  messages: Message[];
}

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
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
      setConversations(res.data);
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
        title: titleText || 'Chat Entry',
        content: contentText,
        mood: 'Reflective',
        tags: ['chatbot', 'saved-from-chat']
      });
      setSaveStatus('Entry saved to Journal!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Failed to save chat to journal', error);
      alert('Failed to save entry to journal.');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
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
        message: userMsgText,
        history: messages,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (res.data.savedToJournal) {
        setSaveStatus('Written entry automatically saved in Journal!');
        setTimeout(() => setSaveStatus(''), 3500);
      }

      if (!currentConvoId && res.data.conversationId) {
        setCurrentConvoId(res.data.conversationId);
        fetchConversations();
      }
    } catch (error: any) {
      console.error('Failed to send message', error);
      const errorMessage = error?.response?.data?.error || 'Failed to send message. Please ensure your API key is set in Settings.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteConvo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await api.delete(`/chat/${id}`);
      if (currentConvoId === id) startNewChat();
      fetchConversations();
    } catch (error) {
      console.error('Failed to delete conversation', error);
    }
  };

  return (
    <div className="space-y-4">
      <ApiKeyBanner onKeySaved={fetchConversations} />

      {saveStatus && (
        <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle size={18} />
          {saveStatus}
        </div>
      )}

      <div className="h-[calc(100vh-12rem)] flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 btn-primary py-2.5 text-sm"
            >
              <Plus size={18} />
              New Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {listLoading ? (
              <div className="p-4 text-center text-slate-400 text-sm">Loading history...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">No recent chats</div>
            ) : (
              conversations.map(convo => (
                <div
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    currentConvoId === convo.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <MessageSquare size={16} className={currentConvoId === convo.id ? 'text-indigo-600' : 'text-slate-400'} />
                    <span className="text-sm font-medium truncate">{convo.title}</span>
                  </div>
                  <button
                    onClick={(e) => deleteConvo(convo.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Bot size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">How can I help you reflect today?</h3>
                  <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm leading-relaxed">
                    Share your thoughts or ask questions. Every first message you write is automatically saved to your <strong>Journal</strong>!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => saveToJournal(`Chat Reflection (${new Date().toLocaleDateString()})`, msg.content)}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-medium px-1 py-0.5"
                          title="Save this response to Journal"
                        >
                          <BookPlus size={12} /> Save to Journal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 rounded-tl-none">
                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-slate-200">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Write your entry or message to AI..."
                className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[50px] max-h-[200px]"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              MindVault AI uses Gemini and Claude AI models. Your entries are kept private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
