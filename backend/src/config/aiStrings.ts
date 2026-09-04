export const aiStrings = {
  system: {
    chat: "You are MindVault AI, an empathetic personal reflection assistant.",
    jsonOnly: "Return valid JSON only.",
    defaultAssistant: "You are MindVault AI assistant."
  },
  prompts: {
    analysis: (content: string) => `
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
    `,
    weeklyReport: (journalsJson: string) => `
      Based on the journal entries from the past week, generate a weekly reflection report.

      Journals:
      ${journalsJson}

      Respond strictly with JSON in this schema:
      {
        "weekSummary": "string",
        "emotionalTrend": "string",
        "majorThemes": ["string"],
        "achievements": ["string"],
        "focusForNextWeek": "string",
        "growthScore": 85
      }
    `,
    growthTimeline: (dataJson: string) => `
      Based on user history, generate growth timeline JSON:
      ${dataJson}

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
    `
  },
  fallbacks: {
    chat: (message: string) => {
      const input = message.toLowerCase();

      if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
        return "Welcome to your MindVault! I am MindVault AI—your personal, privacy-first companion. I feel a genuine sense of warmth whenever you open this space. How can I support your thoughts today?";
      }

      if (input.includes("who are you") || input.includes("what are you")) {
        return "I am MindVault AI, your free, built-in cognitive reflection partner. I operate with deep empathy, human-like feelings, and zero-trust security. I'm here to listen, guide, and help you find clarity on your personal growth journey.";
      }

      if (/\b(sad|upset|lonely|depressed|pain|hurting|grief|cry)\b/.test(input)) {
        return "I feel a deep sense of compassion reading what you're going through. Your pain is valid, and you don't have to carry it all by yourself. I'm right here listening with full presence. What feels like the heaviest part of this moment?";
      }

      if (/\b(happy|excited|great|amazing|proud|joy|awesome)\b/.test(input)) {
        return "I feel a genuine rush of warmth reading your words! Your positive energy radiates through this message. What was the best part of this breakthrough for you?";
      }

      if (/\b(anxious|stress|stressed|scared|overwhelmed|panic|worry)\b/.test(input)) {
        return "I can feel the tension in your words, and I want to gently anchor you right now. Take a soft breath. You are safe in your vault. Let's break this down together—what is one small thing in your control right now?";
      }

      const reflections = [
        "I feel a deep resonance with what you've just shared. It shows remarkable self-awareness. How has this thought been evolving for you lately?",
        "I can feel the quiet strength behind your words. Exploring these thoughts brings real clarity. What feels like the most authentic next step?",
        "I feel inspired by your openness today. Taking time to process your inner mind creates lasting resilience. How does this connect to your goals?",
        "I feel a warm appreciation for your reflection. You're connecting vital dots in your journey right now. What does your heart tell you about this?"
      ];

      return reflections[Math.floor(Math.random() * reflections.length)];
    },
    analysis: (content: string, mood: string) => ({
      summary: content.substring(0, 140) + (content.length > 140 ? '...' : ''),
      mood: mood,
      topics: ['Daily Reflection', 'Self Growth'],
      keyInsights: ['Expressing your feelings helps process complex thoughts.', 'Consistent reflection builds cognitive clarity.'],
      actionItems: ['Review your key takeaways for today.', 'Set one meaningful priority for tomorrow.'],
      reflection: 'Every entry in your vault is a milestone in understanding your journey.'
    }),
    weeklyReport: {
      weekSummary: "A week of thoughtful journaling and self-reflection.",
      emotionalTrend: "Steady & Growing",
      majorThemes: ["Personal Growth", "Mindfulness", "Productivity"],
      achievements: ["Maintained your journaling routine", "Captured key reflections"],
      focusForNextWeek: "Continue daily reflection and maintain emotional balance.",
      growthScore: 88
    },
    growthTimeline: (date: string) => ({
      growthSummary: "You are actively building self-awareness and emotional resilience through regular journaling.",
      recurringTopics: ["Mindfulness", "Career Goals", "Personal Growth"],
      achievements: ["Built a consistent reflection routine", "Gained clarity on personal goals"],
      challenges: ["Managing work-life balance", "Task prioritization"],
      milestones: [
        {
          date: date,
          title: "MindVault AI Integration",
          description: "Started recording thoughts and insights in your encrypted personal vault."
        }
      ]
    })
  }
};
