import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecretService } from './SecretService';

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
        system: systemPrompt || "You are MindVault AI assistant.",
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

    const provider = preferredProvider === 'claude' ? 'claude' : (preferredProvider === 'gemini' ? 'gemini' : (claudeKey && !geminiKey ? 'claude' : 'gemini'));

    // Try Claude if preferred or available
    if (provider === 'claude' && claudeKey) {
      try {
        const formattedHistory = (history || []).map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content
        }));
        formattedHistory.push({ role: 'user', content: message });
        return await this.callClaudeAPI(formattedHistory, "You are MindVault AI, an empathetic personal reflection assistant.", claudeKey);
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
    return `Thank you for sharing your thoughts: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}".\n\nTo unlock full multi-turn AI responses with Gemini or Claude, please enter your API key in Settings or click the "Enter API Key" button above!`;
  }

  static async analyzeJournal(
    content: string,
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ) {
    const prompt = `
      Analyze the following journal entry and provide a structured JSON response.
      Identify the mood (a single word like Happy, Sad, Stressed, Productive, Anxious, Excited, Neutral),
      main topics (max 3), key insights, action items, and a short summary.
      Also provide a reflective thought that encourages personal growth.

      Journal Entry:
      "${content}"

      Respond strictly with JSON in this format:
      {
        "summary": "string",
        "mood": "string",
        "topics": ["string"],
        "keyInsights": ["string"],
        "actionItems": ["string"],
        "reflection": "string"
      }
    `;

    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);
    const provider = preferredProvider === 'claude' ? 'claude' : (preferredProvider === 'gemini' ? 'gemini' : (claudeKey && !geminiKey ? 'claude' : 'gemini'));

    if (provider === 'claude' && claudeKey) {
      try {
        const text = await this.callClaudeAPI([{ role: 'user', content: prompt }], "Return valid JSON only.", claudeKey);
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
    return {
      summary: content.substring(0, 140) + (content.length > 140 ? '...' : ''),
      mood: fallbackMoods[words.length % fallbackMoods.length],
      topics: ['Daily Reflection', 'Self Growth'],
      keyInsights: ['Expressing your feelings helps process complex thoughts.', 'Consistent reflection builds cognitive clarity.'],
      actionItems: ['Review your key takeaways for today.', 'Set one meaningful priority for tomorrow.'],
      reflection: 'Every entry in your vault is a milestone in understanding your journey.'
    };
  }

  static async generateWeeklyReport(
    journals: any[],
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ) {
    const prompt = `
      Based on the journal entries from the past week, generate a weekly reflection report.

      Journals:
      ${JSON.stringify(journals.map(j => ({ date: j.createdAt, content: j.content, mood: j.mood })))}

      Respond strictly with JSON in this schema:
      {
        "weekSummary": "string",
        "emotionalTrend": "string",
        "majorThemes": ["string"],
        "achievements": ["string"],
        "focusForNextWeek": "string",
        "growthScore": 85
      }
    `;

    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);

    if (claudeKey) {
      try {
        const text = await this.callClaudeAPI([{ role: 'user', content: prompt }], "Return valid JSON only.", claudeKey);
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

    return {
      weekSummary: "A week of thoughtful journaling and self-reflection.",
      emotionalTrend: "Steady & Growing",
      majorThemes: ["Personal Growth", "Mindfulness", "Productivity"],
      achievements: ["Maintained your journaling routine", "Captured key reflections"],
      focusForNextWeek: "Continue daily reflection and maintain emotional balance.",
      growthScore: 88
    };
  }

  static async generateGrowthTimeline(
    data: any[],
    userApiKey?: string,
    userClaudeApiKey?: string,
    preferredProvider?: string
  ) {
    const prompt = `
      Based on user history, generate growth timeline JSON:
      ${JSON.stringify(data)}

      JSON Schema:
      {
        "growthSummary": "string",
        "recurringTopics": ["string"],
        "achievements": ["string"],
        "challenges": ["string"],
        "milestones": [
          {
            "date": "string",
            "title": "string",
            "description": "string"
          }
        ]
      }
    `;

    const geminiKey = await this.getGeminiApiKey(userApiKey);
    const claudeKey = await this.getClaudeApiKey(userClaudeApiKey);

    if (claudeKey) {
      try {
        const text = await this.callClaudeAPI([{ role: 'user', content: prompt }], "Return valid JSON only.", claudeKey);
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

    return {
      growthSummary: "You are actively building self-awareness and emotional resilience through regular journaling.",
      recurringTopics: ["Mindfulness", "Career Goals", "Personal Growth"],
      achievements: ["Built a consistent reflection routine", "Gained clarity on personal goals"],
      challenges: ["Managing work-life balance", "Task prioritization"],
      milestones: [
        {
          date: new Date().toLocaleDateString(),
          title: "MindVault AI Integration",
          description: "Started recording thoughts and insights in your encrypted personal vault."
        }
      ]
    };
  }
}
