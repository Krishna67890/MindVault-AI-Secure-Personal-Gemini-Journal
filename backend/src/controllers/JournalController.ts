import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { GeminiService } from '../services/GeminiService';
import { FirestoreRepository } from '../repositories/FirestoreRepository';

export class JournalController {
  static async createEntry(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { title, content, mood, tags } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const entry = await FirestoreRepository.addDocument(uid, 'journalEntries', {
        title: title || 'Untitled Entry',
        content,
        mood,
        tags: tags || [],
      });

      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create journal entry' });
    }
  }

  static async analyzeEntry(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { content } = req.body;
      const userApiKey = req.headers['x-gemini-api-key'] as string;
      const userClaudeApiKey = req.headers['x-claude-api-key'] as string;
      const preferredProvider = req.headers['x-ai-provider'] as string;

      if (!content) {
        return res.status(400).json({ error: 'Content is required for analysis' });
      }

      const analysis = await GeminiService.analyzeJournal(content, userApiKey, userClaudeApiKey, preferredProvider);
      res.json(analysis);
    } catch (error: any) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: error?.message || 'Failed to analyze journal entry' });
    }
  }

  static async getEntries(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const entries = await FirestoreRepository.getDocuments(uid, 'journalEntries');
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch journal entries' });
    }
  }

  static async getEntry(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { id } = req.params;
      const entry = await FirestoreRepository.getDocument(uid, 'journalEntries', id);
      if (!entry) {
        return res.status(404).json({ error: 'Journal entry not found' });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch journal entry' });
    }
  }

  static async updateEntry(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { id } = req.params;
      await FirestoreRepository.updateDocument(uid, 'journalEntries', id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update journal entry' });
    }
  }

  static async deleteEntry(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { id } = req.params;
      await FirestoreRepository.deleteDocument(uid, 'journalEntries', id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete journal entry' });
    }
  }
}
