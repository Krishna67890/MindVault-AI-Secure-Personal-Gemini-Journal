import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { GeminiService } from '../services/GeminiService';
import { FirestoreRepository } from '../repositories/FirestoreRepository';

export class ChatController {
  static async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { conversationId, message, history } = req.body;
      const uid = req.user!.uid;
      const userApiKey = req.headers['x-gemini-api-key'] as string;
      const userClaudeApiKey = req.headers['x-claude-api-key'] as string;
      const preferredProvider = req.headers['x-ai-provider'] as string;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const aiResponse = await GeminiService.generateChatResponse(
        history || [],
        message,
        userApiKey,
        userClaudeApiKey,
        preferredProvider
      );

      const newMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      let activeConvoId = conversationId;

      if (conversationId) {
        // Update existing conversation
        const conversation = await FirestoreRepository.getDocument(uid, 'conversations', conversationId) as any;
        if (conversation) {
          const updatedMessages = [...(conversation.messages || []), newMessage, aiMessage];
          await FirestoreRepository.updateDocument(uid, 'conversations', conversationId, {
            messages: updatedMessages,
          });
        }
      } else {
        // Create new conversation
        const newConversation = await FirestoreRepository.addDocument(uid, 'conversations', {
          title: message.substring(0, 50) + '...',
          messages: [newMessage, aiMessage],
        });
        activeConvoId = newConversation.id;
      }

      // Requirement: "write fist entry when we write this should be save in journel"
      // Save entry to journal if new conversation OR user sent entry
      await FirestoreRepository.addDocument(uid, 'journalEntries', {
        title: `Chat Entry: ${message.substring(0, 30)}...`,
        content: message,
        mood: 'Chatted',
        tags: ['chatbot', 'ai-reflection'],
        createdAt: new Date(),
        aiResponse: aiResponse
      });

      res.json({ response: aiResponse, conversationId: activeConvoId, savedToJournal: true });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error?.message || 'Failed to process chat message' });
    }
  }

  static async getConversations(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const conversations = await FirestoreRepository.getDocuments(uid, 'conversations');
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  static async getConversation(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { id } = req.params;
      const conversation = await FirestoreRepository.getDocument(uid, 'conversations', id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  static async deleteConversation(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { id } = req.params;
      await FirestoreRepository.deleteDocument(uid, 'conversations', id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }
}
