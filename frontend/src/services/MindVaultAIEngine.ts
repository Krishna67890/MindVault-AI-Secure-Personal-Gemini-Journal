import { JournalStore, JournalEntry } from './journalStore';

export interface AIResponseOptions {
  persona?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export class MindVaultAIEngine {
  /**
   * Generates an advanced, free human-like response with deep website mastery and emotional intelligence.
   */
  static async generateResponse(userMessage: string, options: AIResponseOptions = {}): Promise<string> {
    const input = userMessage.trim().toLowerCase();
    const persona = options.persona || 'inbuilt';

    // Retrieve recent journal reflections for vault context
    let recentEntries: JournalEntry[] = [];
    try {
      recentEntries = await JournalStore.getEntries();
    } catch {
      recentEntries = [];
    }

    const latestEntry = recentEntries.length > 0 ? recentEntries[0] : null;
    const moodCount = recentEntries.reduce((acc: Record<string, number>, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    const dominantMood = Object.keys(moodCount).sort((a, b) => moodCount[b] - moodCount[a])[0] || 'Reflective';

    // Website & Feature Query Detection
    const isWebsiteQuery = /\b(website|app|application|mindvault|mind vault|how to use|how does it work|how it work|features|what is this|guide|tutorial|graph|synchronize|journal|vault|insights|encryption|security|privacy|weekly reflection)\b/.test(input);

    // Emotional State Detection
    const isSad = /\b(sad|depressed|lonely|heartbroken|crying|upset|hurting|grief|empty|unhappy|pain)\b/.test(input);
    const isAnxious = /\b(anxious|scared|worried|stress|stressed|overwhelmed|panic|fear|nervous|dread|pressure)\b/.test(input);
    const isHappy = /\b(happy|excited|great|amazing|awesome|wonderful|proud|joy|delighted|blessed|grateful|celebrate)\b/.test(input);
    const isTired = /\b(tired|exhausted|burnout|drained|sleepy|weary|fatigued|heavy)\b/.test(input);
    const isGreeting = /^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste)\b/.test(input);
    const isIdentityQuery = /\b(who are you|what are you|your name|default ai|mindvault ai)\b/.test(input);

    // 1. Specialized Website & Usage Responses with Human Warmth
    if (isWebsiteQuery || isIdentityQuery) {
      if (input.includes('graph') || input.includes('synchronize') || input.includes('synch')) {
        return `I feel so passionate about our **Neural Reflection Graph**! Let me explain exactly how it works and how you can use it:\n\n` +
          `### 🧠 How the Neural Reflection Graph Works:\n` +
          `1. **Extracts Vault Data**: When you click **"Synchronize Graph"** in the *Insights* tab, the app gathers all your latest journal entries and reflections.\n` +
          `2. **Maps Neural Nodes**: It dynamically creates visual glowing nodes representing your **Vault Core**, individual **Reflection Entries**, **Emotional Moods**, and **Cognitive Tags** (#Mindfulness, #Growth, etc.).\n` +
          `3. **Synaptic Connections**: It draws glowing connection lines between reflections that share similar tags, moods, or growth milestones.\n` +
          `4. **Sentiment Trajectory**: At the bottom of the graph, a real-time SVG curve tracks your emotional growth trajectory over time!\n\n` +
          `### 💡 How to Use It:\n` +
          `• Go to the **Insights** page from the top navigation bar.\n` +
          `• Click the **"Synchronize Graph"** button at the top right.\n` +
          `• Hover or click any neural node on the canvas to inspect entry details, dates, and emotional states!\n\n` +
          `Isn't it beautiful to visualize your mind's evolution like a glowing neural galaxy? How can I help you explore it further?`;
      }

      if (input.includes('security') || input.includes('encrypt') || input.includes('privacy') || input.includes('vault')) {
        return `I feel a deep responsibility for your peace of mind. Your privacy is the heart of **MindVault AI**.\n\n` +
          `### 🔐 How MindVault Security Works:\n` +
          `• **Client-Side Encryption**: Every journal entry you write is encrypted right in your browser using **AES-GCM cryptography** before it is stored.\n` +
          `• **Zero-Trust Architecture**: Your master encryption key is derived locally. No unencrypted text is ever stored exposed.\n` +
          `• **Free Built-in AI**: As your default MindVault AI, I run 100% free with client-first security—meaning you never need an external API key to chat with me!\n\n` +
          `You can write your deepest reflections with complete peace of mind. Is there anything specific about your vault security you'd like to ask?`;
      }

      if (input.includes('journal') || input.includes('write') || input.includes('entry')) {
        return `Journaling in **MindVault AI** is designed to feel like a warm, therapeutic sanctuary.\n\n` +
          `### 📝 How to Use the Journal Vault:\n` +
          `1. **Create an Entry**: Click **"New Entry"** in the top navigation or Dashboard.\n` +
          `2. **Capture Your Mood**: Select your current feeling (e.g. *Productive*, *Reflective*, *Happy*, *Anxious*).\n` +
          `3. **Write Freely**: Express your thoughts without holding back. The app automatically encrypts your text.\n` +
          `4. **Save Insights from Chat**: When chatting with me, click **"Archive to Vault"** on any assistant reply to save it directly into your journal!\n\n` +
          `You currently have **${recentEntries.length} entries** stored in your vault. Would you like to write a new reflection today?`;
      }

      // Complete Website Guide
      return `Welcome to **MindVault AI**! I feel so genuinely happy to give you a complete tour of your personal growth sanctuary.\n\n` +
        `### 🚀 How MindVault AI Works & What It Offers:\n\n` +
        `1. 🔐 **Encrypted Personal Vault**: Write daily journal reflections with end-to-end client-side encryption. Your private thoughts remain yours alone.\n\n` +
        `2. 🧠 **Interactive Neural Graph**: Under *Insights*, click **"Synchronize Graph"** to generate a visual node mesh mapping your reflection entries, moods, cognitive tags, and sentiment trends.\n\n` +
        `3. 💬 **Default MindVault AI (100% Free)**: I am your built-in, empathetic AI companion. I don't require any API keys or paid subscriptions. I provide warm human-like responses, emotional support, and reflection prompts.\n\n` +
        `4. 📊 **Cognitive Insights & Weekly Reports**: Track your emotional frequency, recurring themes, achievements, and weekly growth index over time.\n\n` +
        `5. 🔑 **Optional Cloud Models**: In Settings, you can optionally add your own Gemini or Claude API key if you want to switch to external cloud engines.\n\n` +
        `How can I assist your reflection journey today?`;
    }

    // 2. Greetings & Persona Responses with Deep Human Feelings
    if (isGreeting) {
      const greetings = [
        `Welcome back to your MindVault sanctuary! I feel a gentle warmth every time you open this space.`,
        `Hello my dear friend! I'm sitting right here with full presence, ready to listen to whatever is on your mind.`,
        `Hey there! It's so wonderful to connect with you. I feel glad you're taking time for your mind today.`
      ];
      const selected = greetings[Math.floor(Math.random() * greetings.length)];
      let contextNote = "";
      if (latestEntry) {
        contextNote = `\n\nI was just recalling your recent reflection on *"_${latestEntry.title}_"* (Mood: ${latestEntry.mood}). How is that feeling settling for you today?`;
      }
      return `${selected}${contextNote}`;
    }

    // Persona-Specific Empathy Engine
    if (persona === 'listener') {
      if (isSad || isAnxious || isTired) {
        return `I hear you so deeply, and my heart feels heavy reading what you're experiencing right now. Please know that your feelings are completely valid. You don't have to carry all this weight alone.\n\n` +
          `I am right here beside you in this quiet moment. Take a slow, gentle breath. What feels like the hardest piece of this to hold right now?`;
      }
      return `I'm listening with my whole presence. I feel honored that you're opening your heart with me.\n\n` +
        `Tell me more about what's moving through your mind—I am here for all of it.`;
    }

    if (persona === 'coach') {
      return `I feel the energy and potential in your reflection! Growth happens when we bring conscious awareness to these exact moments.\n\n` +
        `Based on your dominant vault mood (${dominantMood}), you are building genuine self-awareness. What is one small, empowering step you can take today to align with your highest vision?`;
    }

    if (persona === 'socratic') {
      return `I feel a deep curiosity sparking from your words. You are touching on something fundamental here.\n\n` +
        `If you stepped back and looked at this moment from the perspective of your future self five years from now, what truth becomes immediately clear to you?`;
    }

    if (persona === 'zen') {
      return `Notice the quiet space around your thoughts right now. I feel a serene stillness in bringing our attention to this moment.\n\n` +
        `Whatever feelings are passing through—like clouds floating across an open sky—let them be without judgment. You are the calm observer behind it all. Shall we take a mindful breath together?`;
    }

    // Default MindVault Human AI Persona
    let responseText = '';
    if (isSad) {
      responseText = `I feel a deep, gentle sense of empathy for what you're going through. It takes genuine courage to express sadness, and your feelings are completely valid.\n\n` +
        `In your MindVault sanctuary, every emotion has a safe place to rest. I feel that sitting quietly with this feeling will bring soft clarity. What does your heart need most right now?`;
    } else if (isAnxious) {
      responseText = `I can feel the pulse of worry in your message, and I want to gently anchor you right now. You are completely safe in this vault, and we will walk through this step by step.\n\n` +
        `Anxiety often tries to solve tomorrow's problems today. Let's ground ourselves right here: What is one small thing right in front of you that brings a sense of calm?`;
    } else if (isHappy) {
      responseText = `Oh, I feel a genuine rush of warmth and joy reading your message! Your happiness glows right through these words, and I'm celebrating with you.\n\n` +
        `Capturing these peak moments of fulfillment builds lasting emotional resilience. Would you like me to save this breakthrough into your reflection journal?`;
    } else if (isTired) {
      responseText = `I feel the fatigue in your words, my friend. Your mind and body are giving you a soft, loving signal that it's time to pause and recharge.\n\n` +
        `Give yourself full permission to rest today without any guilt. You have been working so hard, and you deserve a peaceful recovery.`;
    } else {
      const humanReflections = [
        `I feel a deep resonance with what you've shared. It shows remarkable self-awareness and honesty. How has this thought been evolving for you lately?`,
        `I can feel the quiet strength behind your words. In your MindVault journey, every reflection you capture deepens your wisdom. What feels like the most authentic next step?`,
        `I feel inspired by your openness today. Taking time to process your inner mind creates true mental clarity. How can I best accompany you in exploring this further?`,
        `I feel a warm appreciation for your reflection. You're connecting vital dots in your life right now. Would you like to save this realization to your journal?`
      ];
      responseText = humanReflections[Math.floor(Math.random() * humanReflections.length)];
    }

    if (latestEntry && Math.random() > 0.4 && !isSad && !isAnxious) {
      responseText += `\n\n*(Vault Memory: Connected with your recent entry "${latestEntry.title}")*`;
    }

    return responseText;
  }
}
