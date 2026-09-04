import api from './api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: any;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: any;
  messages: Message[];
}

const STORAGE_KEY = 'mindvault_chat_conversations_v2';

export class ChatStore {
  private static getLocalConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static setLocalConversations(convos: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
    } catch (err) {
      console.warn('Failed to save conversations to local storage:', err);
    }
  }

  /**
   * Fetch all conversation history sessions (merged local storage & backend)
   */
  static async getConversations(): Promise<Conversation[]> {
    const locals = this.getLocalConversations();
    let remoteDocs: Conversation[] = [];

    try {
      const res = await api.get('/chat');
      if (Array.isArray(res.data)) {
        remoteDocs = res.data;
      }
    } catch {
      console.warn('Backend fetch chat conversations warning (using local history)');
    }

    const map = new Map<string, Conversation>();
    locals.forEach(c => map.set(c.id, c));
    remoteDocs.forEach(r => {
      if (r.id) map.set(r.id, r);
    });

    const combined = Array.from(map.values());
    combined.sort((a, b) => {
      const getTime = (val: any) => {
        if (!val) return 0;
        if (val._seconds) return val._seconds * 1000;
        const d = new Date(val);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      };
      return getTime(b.updatedAt || b.messages?.[b.messages.length - 1]?.timestamp) - getTime(a.updatedAt || a.messages?.[a.messages.length - 1]?.timestamp);
    });

    this.setLocalConversations(combined);
    return combined;
  }

  /**
   * Get single conversation session by ID
   */
  static async getConversation(id: string): Promise<Conversation | null> {
    const locals = this.getLocalConversations();
    const localMatch = locals.find(c => c.id === id);

    try {
      const res = await api.get(`/chat/${id}`);
      if (res.data && res.data.id) {
        return res.data;
      }
    } catch {
      console.warn(`Backend fetch single conversation ${id} warning`);
    }

    return localMatch || null;
  }

  /**
   * Save or update conversation history session
   */
  static async saveConversation(convo: Conversation): Promise<void> {
    const locals = this.getLocalConversations();
    const idx = locals.findIndex(c => c.id === convo.id);
    const updatedConvo = {
      ...convo,
      updatedAt: new Date().toISOString()
    };

    if (idx !== -1) {
      locals[idx] = updatedConvo;
    } else {
      locals.unshift(updatedConvo);
    }

    this.setLocalConversations(locals);
  }

  /**
   * Delete conversation history session
   */
  static async deleteConversation(id: string): Promise<void> {
    const locals = this.getLocalConversations();
    const filtered = locals.filter(c => c.id !== id);
    this.setLocalConversations(filtered);

    try {
      await api.delete(`/chat/${id}`);
    } catch (err) {
      console.warn(`Backend delete conversation ${id} warning:`, err);
    }
  }
}
