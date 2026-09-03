import api from './api';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags?: string[];
  analysis?: any;
  createdAt: string | any;
  updatedAt?: string | any;
}

const STORAGE_KEY = 'mindvault_user_journals_v2';

export class JournalStore {
  // Get all local entries
  private static getLocalEntries(): JournalEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save entries to local storage
  private static setLocalEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }

  // Save new entry (offline first + backend sync)
  static async saveEntry(data: { title: string; content: string; mood?: string; tags?: string[]; analysis?: any }): Promise<JournalEntry> {
    const nowIso = new Date().toISOString();
    const tempId = 'entry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newEntry: JournalEntry = {
      id: tempId,
      title: data.title || 'Untitled Entry',
      content: data.content,
      mood: data.mood || 'Neutral',
      tags: data.tags || [],
      analysis: data.analysis || null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Save locally immediately
    const locals = this.getLocalEntries();
    locals.unshift(newEntry);
    this.setLocalEntries(locals);

    // Sync to backend asynchronously
    try {
      const res = await api.post('/journals', {
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: newEntry.tags,
        analysis: newEntry.analysis,
      });

      if (res.data && res.data.id) {
        // Replace tempId with actual server doc ID if provided
        const currentLocals = this.getLocalEntries();
        const index = currentLocals.findIndex(e => e.id === tempId);
        if (index !== -1) {
          currentLocals[index].id = res.data.id;
          this.setLocalEntries(currentLocals);
        }
        return { ...newEntry, id: res.data.id };
      }
    } catch (err) {
      console.warn('Backend sync warning (entry safely saved in local vault):', err);
    }

    return newEntry;
  }

  // Fetch all entries (merge local storage & backend API)
  static async getEntries(): Promise<JournalEntry[]> {
    const locals = this.getLocalEntries();
    let remoteDocs: JournalEntry[] = [];

    try {
      const res = await api.get('/journals');
      if (Array.isArray(res.data)) {
        remoteDocs = res.data;
      }
    } catch (err) {
      console.warn('Backend fetch warning (using local vault storage):', err);
    }

    // Merge by id or content signature
    const map = new Map<string, JournalEntry>();

    // Add local entries first
    locals.forEach(e => map.set(e.id, e));

    // Add/overwrite with remote entries
    remoteDocs.forEach(r => {
      if (r.id) map.set(r.id, r);
    });

    const combined = Array.from(map.values());

    // Sort by createdAt descending
    combined.sort((a, b) => {
      const getTime = (val: any) => {
        if (!val) return 0;
        if (val._seconds) return val._seconds * 1000;
        const d = new Date(val);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      };
      return getTime(b.createdAt) - getTime(a.createdAt);
    });

    // Update local storage cache
    this.setLocalEntries(combined);

    return combined;
  }

  // Get single entry by ID
  static async getEntry(id: string): Promise<JournalEntry | null> {
    const locals = this.getLocalEntries();
    const localMatch = locals.find(e => e.id === id);

    try {
      const res = await api.get(`/journals/${id}`);
      if (res.data) {
        return res.data;
      }
    } catch {
      console.warn(`Backend fetch single entry ${id} fallback to local storage`);
    }

    return localMatch || null;
  }

  // Update entry
  static async updateEntry(id: string, data: Partial<JournalEntry>): Promise<void> {
    const locals = this.getLocalEntries();
    const index = locals.findIndex(e => e.id === id);
    const nowIso = new Date().toISOString();

    if (index !== -1) {
      locals[index] = { ...locals[index], ...data, updatedAt: nowIso };
      this.setLocalEntries(locals);
    }

    try {
      await api.put(`/journals/${id}`, data);
    } catch (err) {
      console.warn(`Backend update entry ${id} warning:`, err);
    }
  }

  // Delete entry
  static async deleteEntry(id: string): Promise<void> {
    const locals = this.getLocalEntries();
    const filtered = locals.filter(e => e.id !== id);
    this.setLocalEntries(filtered);

    try {
      await api.delete(`/journals/${id}`);
    } catch (err) {
      console.warn(`Backend delete entry ${id} warning:`, err);
    }
  }
}
