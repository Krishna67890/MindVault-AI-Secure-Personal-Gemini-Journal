import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { GeminiService } from '../services/GeminiService';
import { FirestoreRepository } from '../repositories/FirestoreRepository';

export class GrowthController {
  static async generateInsights(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const userApiKey = req.headers['x-gemini-api-key'] as string;
      const userClaudeApiKey = req.headers['x-claude-api-key'] as string;
      const preferredProvider = req.headers['x-ai-provider'] as string;

      // Fetch recent journal entries and conversations for analysis
      const journals = await FirestoreRepository.getDocuments(uid, 'journalEntries', 20);
      const conversations = await FirestoreRepository.getDocuments(uid, 'conversations', 10);

      if (journals.length === 0 && conversations.length === 0) {
        return res.json({
          status: 'insufficient_data',
          message: 'Keep journaling to unlock deeper personal insights. Write at least 1 entry.',
        });
      }

      const combinedData = {
        journals: journals.map((j: any) => ({ content: j.content, date: j.createdAt, mood: j.mood })),
        conversations: conversations.map((c: any) => ({
          messages: c.messages?.map((m: any) => m.content),
          date: c.createdAt,
        })),
      };

      const insights = await GeminiService.generateGrowthTimeline(
        [combinedData],
        userApiKey,
        userClaudeApiKey,
        preferredProvider
      );

      if (insights) {
        await FirestoreRepository.addDocument(uid, 'insights', {
          ...insights,
          generatedAt: new Date(),
          type: 'advanced_growth'
        });
      }

      res.json(insights);
    } catch (error: any) {
      console.error('Insights generation error:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate growth insights' });
    }
  }

  static async getInsights(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const insights = await FirestoreRepository.getDocuments(uid, 'insights', 10);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  }

  static async generateWeeklyReflection(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { startDate, endDate } = req.body;
      const userApiKey = req.headers['x-gemini-api-key'] as string;
      const userClaudeApiKey = req.headers['x-claude-api-key'] as string;
      const preferredProvider = req.headers['x-ai-provider'] as string;

      // Get entries from the last 7 days
      const recentEntries = await FirestoreRepository.getDocuments(uid, 'journalEntries', 15);

      if (recentEntries.length === 0) {
        return res.json({
          status: 'no_data',
          message: 'No journal entries found to generate a report. Write a journal entry first.',
        });
      }

      const report = await GeminiService.generateWeeklyReport(
        recentEntries,
        userApiKey,
        userClaudeApiKey,
        preferredProvider
      );

      if (report) {
        await FirestoreRepository.addDocument(uid, 'weeklyReflections', {
          ...report,
          generatedAt: new Date(),
          startDate: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: endDate || new Date(),
        });
      }

      res.json(report);
    } catch (error: any) {
      console.error('Weekly report error:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate weekly reflection' });
    }
  }

  static async getWeeklyReflections(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const reflections = await FirestoreRepository.getDocuments(uid, 'weeklyReflections');
      res.json(reflections);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weekly reflections' });
    }
  }
}
