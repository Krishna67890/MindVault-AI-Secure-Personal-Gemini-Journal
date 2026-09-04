import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecretService } from './SecretService';
import { aiStrings } from '../config/aiStrings';

export class GeminiService {
  private static cleanKey(key?: string) {
    if (!key || typeof key !== 'string') return undefined;
    const trimmed = key.trim();
    if (
      trimmed === '' ||
      trimmed === 'undefined' ||
      trimmed === 'null' ||
      trimmed === 'PASTE_YOUR_GEMINI_API_KEY_HERE' ||
      trimmed === 'PASTE_YOUR_CLAUDE_API_KEY_HERE'
    ) {
      return undefined;
    }
    return trimmed;
  }

  private static async getGeminiApiKey(userApiKey?: string): Promise<string | undefined> {
    const userKey = this.cleanKey(userApiKey);
    if (userKey) return userKey;

    try {
      const secretKey = await SecretService.getSecret('GEMINI_API_KEY');
      return this.cleanKey(secretKey);
    } catch {
      return process.env.GEMINI_API_KEY ? this.cleanKey(process.env.GEMINI_API_KEY) : undefined;
    }
  }

  private static async getClaudeApiKey(userClaudeKey?: string): Promise<string | undefined> {
    const userKey = this.cleanKey(userClaudeKey);
    if (userKey) return userKey;

    try {
      const secretKey = await SecretService.getSecret('CLAUDE_API_KEY');
      return this.cleanKey(secretKey);
    } catch {
      return process.env.CLAUDE_API_KEY ? this.cleanKey(process.env.CLAUDE_API_KEY) : undefined;
    }
  }

  private static async callClaudeAPI(messages: { role: string; content: string }[], systemPrompt?: string, apiKey?: string) {
    const claudeKey = await this.getClaudeApiKey(apiKey);
    if (!claudeKey) {
      throw new Error('CLAUDE_API_KEY_NOT_FOUND');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: systemPrompt || aiStrings.system.defaultAssistant,
        messages: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Claude API Error: ${response.status}`);
    }

    const data: any = await response.json();
    return data.content?.[0]?.text || '';
  }

  static async generateChatResponse(
    history: any[],
    message: string,
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ): Promise<string> {
    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);

    const provider = preferredProvider === 'inbuilt' ? 'inbuilt' : (preferredProvider === 'claude' ? 'claude' : (preferredProvider === 'gemini' ? 'gemini' : (claudeKey && !geminiKey ? 'claude' : 'gemini')));

    // If inbuilt is explicitly selected, skip API calls
    if (provider === 'inbuilt') {
      return aiStrings.fallbacks.chat(message);
    }

    // Try Claude if preferred or available
    if (provider === 'claude' && claudeKey) {
      try {
        const formattedHistory = (history || []).map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content
        }));
        formattedHistory.push({ role: 'user', content: message });
        return await this.callClaudeAPI(formattedHistory, aiStrings.system.chat, claudeKey);
      } catch (err: any) {
        console.warn('Claude API error, attempting Gemini fallback:', err?.message);
      }
    }

    // Try Gemini if key available
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({
          history: (history || []).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
        });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      } catch (err: any) {
        console.warn('Gemini API error, falling back to smart reflection:', err?.message);
      }
    }

    // Smart fallback if no API key is provided or API calls fail
    return aiStrings.fallbacks.chat(message);
  }

  static async analyzeJournal(
    content: string,
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ) {
    const prompt = aiStrings.prompts.analysis(content);

    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);
    const provider = preferredProvider === 'claude' ? 'claude' : (preferredProvider === 'gemini' ? 'gemini' : (claudeKey && !geminiKey ? 'claude' : 'gemini'));

    if (provider === 'claude' && claudeKey) {
      try {
        const text = await this.callClaudeAPI([{ role: 'user', content: prompt }], aiStrings.system.jsonOnly, claudeKey);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (err: any) {
        console.warn('Claude analysis error, fallback to Gemini or smart template:', err?.message);
      }
    }

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (err: any) {
        console.warn('Gemini analysis error, fallback to smart template:', err?.message);
      }
    }

    // Smart fallback analysis if keys fail or missing
    const fallbackMoods = ['Productive', 'Reflective', 'Neutral', 'Optimistic'];
    const words = content.split(/\s+/).filter(Boolean);
    const mood = fallbackMoods[words.length % fallbackMoods.length];
    return aiStrings.fallbacks.analysis(content, mood);
  }

  static async generateWeeklyReport(
    journals: any[],
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ) {
    const prompt = aiStrings.prompts.weeklyReport(JSON.stringify(journals.map(j => ({ date: j.createdAt, content: j.content, mood: j.mood }))));

    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);

    if (claudeKey) {
      try {
        const text = await this.callClaudeAPI([{ role: 'user', content: prompt }], aiStrings.system.jsonOnly, claudeKey);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch {}
    }

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch {}
    }

    return aiStrings.fallbacks.weeklyReport;
  }

  static async generateGrowthTimeline(
    data: any[],
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ) {
    const prompt = aiStrings.prompts.growthTimeline(JSON.stringify(data));

    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);

    if (claudeKey) {
      try {
        const text = await this.callClaudeAPI([{ role: 'user', content: prompt }], aiStrings.system.jsonOnly, claudeKey);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch {}
    }

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch {}
    }

    return aiStrings.fallbacks.growthTimeline(new Date().toLocaleDateString());
  }
}
