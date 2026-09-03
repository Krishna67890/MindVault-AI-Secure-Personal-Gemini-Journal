export const strings = {
  common: {
    appName: "MindVault AI",
    signIn: "Sign In",
    enterVault: "Enter Vault",
    loading: "Loading Vault..."
  },
  nav: {
    demo: "Live Demo",
    architecture: "Neural Architecture",
    security: "Vault Security",
    about: "About Us"
  },
  landing: {
    hero: {
      badge: "Next-Gen Private AI Sanctuary",
      titleMain: "Elevate Your",
      titleAccent: "Inner Dialogue",
      description: "Converge everyday thoughts with Gemini & Claude neural models inside a 100% private, client-encrypted digital vault designed for personal cognitive evolution.",
      ctaStart: "Start Free Vault Session",
      ctaDemo: "Live Neural Sandbox"
    },
    metrics: {
      privacy: { label: "Privacy Architecture", value: "100% Client-Side" },
      models: { label: "Supported Models", value: "Gemini & Claude" },
      latency: { label: "Neural Processing", value: "< 15ms Latency" },
      logs: { label: "Zero Log Policy", value: "No Server Logs" }
    },
    workspace: {
      title: "MindVault Workspace v9.2",
      tabs: {
        chat: "Neural Chat",
        growth: "Growth Matrix",
        security: "Fortress Security"
      },
      chat: {
        persona: "Gemini Pro - Deep Listener Persona",
        status: "Neural Link Established",
        encryption: "100% Encrypted Stream",
        mockUser: "I completed my core project milestone today, but I'm unsure what to prioritize next.",
        mockAI: "Celebration is the first step of integration! Based on your journal history, taking 15 minutes to consolidate your insights before starting the next goal yields 40% higher clarity.",
        action: "Action item:",
        actionText: "Archive insight to vault timeline"
      },
      growth: {
        title: "Cognitive Growth Index",
        score: "Score: 94/100",
        awareness: "Self Awareness",
        resilience: "Resilience",
        alignment: "Goal Alignment"
      },
      security: {
        title: "Zero-Trust Vault Security",
        status: "Status: Active",
        storageTitle: "Client Key Storage",
        storageDesc: "API keys remain exclusively inside client environment.",
        rulesTitle: "Firebase Security Rules",
        rulesDesc: "Strict UID isolation preventing cross-account access."
      },
      footerLeft: "MINDVAULT CORE ENGINE",
      footerRight: "SYNCHRONIZED WITH FIREBASE & GEMINI"
    },
    sandbox: {
      badge: "Interactive Live Sandbox",
      title: "Test Neural Extraction Now",
      description: "Type any reflection or thought below to preview real-time AI sentiment, cognitive topic tagging, and actionable insight extraction.",
      label: "Enter Sample Thought / Journal Entry",
      defaultInput: "I had a high-pressure presentation today. I felt nervous initially, but once I started talking, I gained confidence and delivered well.",
      buttonProcessing: "Processing Neural Graph...",
      buttonAnalyze: "Analyze Sample Entry",
      resultTitle: "Extracted Cognitive Map",
      detectedMood: "Detected Emotional Frequency",
      extractedTopics: "Extracted Topics",
      defaultMood: "Resilient & Focused",
      defaultInsight: "Overcoming initial anxiety through action builds durable cognitive resilience."
    },
    calculator: {
      badge: "Cognitive Growth Projection",
      title: "Quantify Your Mental Evolution",
      description: "Drag the slider to see how regular reflection transforms your self-awareness score over time.",
      label: "Consistent Reflection Time:",
      unit: "Days",
      metricEntries: "Reflections Vaulted",
      metricClarity: "Clarity Gain",
      metricStress: "Stress Reduction"
    },
    securitySection: {
      title: "Uncompromising Security Architecture",
      description: "Your thoughts are your private digital legacy. MindVault enforces mathematical data isolation.",
      cards: [
        {
          title: "Firebase UID Isolation",
          description: "Firestore security rules explicitly prevent user A from reading or modifying any document owned by user B."
        },
        {
          title: "Client-Side Key Vault",
          description: "Your Gemini and Claude API keys are stored exclusively in your browser's encrypted local storage."
        },
        {
          title: "Zero AI Data Retraining",
          description: "We consume official enterprise API endpoints where inputs are never used to train global AI foundation models."
        }
      ]
    },
    cta: {
      title: "Ready to start your digital legacy?",
      description: "Initialize your free private neural vault in seconds with Google Secure Sign-In.",
      button: "Get Started Now"
    },
    footer: "© 2026 MindVault AI • Privacy-First Neural Innovation"
  },
  login: {
    branding: {
      title: "Enter the Secure Realm of",
      accent: "Self-Reflection.",
      description: "Authenticate to unlock your encrypted reflections, AI neural chat, and cognitive evolution insights.",
      footer: "End-to-End Encrypted Vault"
    },
    form: {
      titleLogin: "Welcome Back",
      titleRegister: "Create Vault Account",
      subtitle: "Authenticate using your Google identity to access your isolated vault.",
      emailLabel: "Email Protocol",
      emailPlaceholder: "name@neural.link",
      passwordLabel: "Security Key",
      passwordPlaceholder: "••••••••",
      submitButton: "Email Sign In (Demo)",
      ssoSeparator: "Recommended SSO",
      googleButton: "Sign in with Google",
      toggleRegister: "Need a neural vault? Create one",
      toggleLogin: "Already registered? Sign in",
      backToLanding: "Return to Landing Page"
    },
    errors: {
      authFailed: "Authentication failed. Please check your connection or popup permissions.",
      restricted: "Direct Email/Password is currently restricted. Please use Google Secure Sign-In for zero-trust vault access."
    }
  },
  dashboard: {
    catalysts: [
      "What is one lesson you learned today that surprised you?",
      "What challenge did you navigate today, and what strength did it reveal?",
      "What are three subtle things you feel grateful for right now?",
      "If you could give your morning self one sentence of advice, what would it be?",
      "What is a core goal you want to make steady progress on this week?"
    ],
    hero: {
      badge: "Neural Vault Synced",
      streakSuffix: "-Day Streak",
      greetings: {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening"
      },
      fallbackName: "Reflector",
      descriptionPrefix: "Your vault is secured. You have ",
      descriptionSuffix: " reflections stored across your encrypted personal timeline.",
      ctaReflection: "Create Reflection",
      ctaChat: "AI Neural Chat",
      streakLabel: "Reflection Streak",
      streakUnit: "Days"
    },
    stats: {
      reflections: { label: "Reflections", trend: "+3 this week" },
      aiSessions: { label: "AI Sessions", trend: "Neural Chat Active" },
      streak: { label: "Daily Streak", trend: "Consistency Level 1" },
      growth: { label: "Growth Index", trend: "Based on AI Graph" }
    },
    console: {
      title: "Instant Vault Console",
      subtitle: "Record a quick thought or memory right now",
      success: "Vaulted!",
      placeholder: "What's on your mind right now? (Press Enter to vault)",
      buttonSaving: "Saving...",
      buttonVault: "Vault Thought"
    },
    recent: {
      title: "Recent Reflections",
      filterPlaceholder: "Filter entries...",
      viewAll: "View All",
      untitled: "Untitled Reflection",
      empty: {
        title: "Your Vault is Empty",
        description: "Capture your first reflection to initialize your encrypted timeline.",
        button: "Initialize First Entry"
      }
    },
    tools: {
      title: "Core Tools",
      chat: { label: "AI Neural Chat", desc: "Interactive reflection assistant" },
      insights: { label: "Neural Insights", desc: "Psychological graph & matrix" },
      weekly: { label: "Weekly Report", desc: "Executive 7-day reflection" }
    },
    catalystSection: {
      title: "Daily Catalyst",
      next: "Next Catalyst",
      button: "Answer Catalyst"
    }
  },
  chat: {
    saveStatus: "Saved to Vault Archives!",
    autoVaultStatus: "Insight automatically vaulted in Journal!",
    errorPrefix: "Failed to send message. Please verify your API key in Settings.",
    sidebar: {
      newChat: "New Reflection Session",
      searchPlaceholder: "Search sessions...",
      historyTitle: "Previous Encrypted Sessions",
      loadingHistory: "Decrypting History...",
      noSessions: "No sessions found",
      untitledSession: "Neural Session",
      deleteConfirm: "Erase this conversation session?"
    },
    interface: {
      personaLabel: "Select AI Persona:",
      clientEncrypted: "Client Encrypted",
      emptyState: {
        title: "Begin Your Neural Reflection",
        description: "Select an AI persona above and share what's on your mind. Key insights can be archived directly into your encrypted vault with one click."
      },
      actions: {
        archive: "Archive to Vault",
        speak: "Listen to response (Text to Speech)",
        copy: "Copy to clipboard"
      },
      inputPlaceholder: "Ask a question or share a thought...",
      defaultTitle: "Chat Insight Reflection"
    },
    personas: [
      { id: 'listener', name: 'Gemini Deep Listener', desc: 'Empathic reflection & active listener' },
      { id: 'coach', name: 'Claude Cognitive Coach', desc: 'Strategic clarity & actionable goals' },
      { id: 'socratic', name: 'Socratic Philosopher', desc: 'Deep questioning & perspective shifts' },
      { id: 'zen', name: 'Zen Mindfulness Guide', desc: 'Calm, grounding thoughts & presence' }
    ]
  },
  journal: {
    header: {
      tag: "Encrypted Archives",
      title: "Your Reflections",
      description: "Access your full encrypted thought archive. Filter by mood, view timelines, or export your data.",
      exportBtn: "Export Vault",
      newBtn: "New Reflection"
    },
    controls: {
      searchPlaceholder: "Search entry titles, content, or #tags...",
      moods: ['All', 'Happy', 'Neutral', 'Sad', 'Stressed', 'Excited', 'Productive', 'Reflective'],
      viewModes: {
        grid: "Grid View",
        timeline: "Timeline View",
        compact: "Compact List View"
      }
    },
    emptyState: {
      title: "No Reflections Found",
      searchMatchError: "No records match your active search filter.",
      noRecords: "Your vault is clear. Ready to write your first reflection?"
    },
    entry: {
      untitled: "Untitled Thought",
      deleteConfirm: "Are you sure you want to erase this reflection from your vault?"
    }
  },
  insights: {
    loading: "Computing Cognitive Matrix",
    hero: {
      tag: "Neural Growth Graph",
      title: "Cognitive Insights",
      description: "Advanced psychological reflection, emotional trend tracking, and neural pattern recognition derived from your private vault.",
      syncBtn: "Synchronize Graph"
    },
    empty: {
      title: "Neural Map Empty",
      description: "Synchronize your neural graph to visualize emotional trends, growth milestones, and cognitive patterns.",
      analyzeBtn: "Analyze Journey"
    },
    synthesis: {
      tag: "Cognitive Synthesis",
      defaultGrowth: "Based on your {count} vault entries, you are consistently building self-awareness and emotional equilibrium.",
      defaultGrowthAlt: "Reflecting across your {count} stored entries shows steady emotional growth and high cognitive clarity."
    },
    metrics: {
      spectrum: {
        title: "Emotional Frequency Spectrum",
        tag: "Vault Timeline",
        states: [
          "Productive & Focused State",
          "Positive Resonance & Clarity",
          "Deep Socratic Reflection",
          "Elevated Challenge / Stress"
        ]
      },
      matrix: {
        title: "Cognitive Matrix",
        optimal: "Optimal",
        labels: {
          awareness: "Self Awareness",
          alignment: "Goal Alignment",
          eq: "Emotional EQ",
          sync: "System Sync"
        }
      }
    },
    analysis: {
      topics: "Neural Topic Nodes",
      accomplishments: "Key Accomplishments",
      opportunities: "Growth Opportunities"
    },
    timeline: {
      title: "Growth Milestone Timeline"
    },
    footer: {
      shield: "Insights are calculated on client requests. Your psychological graph is isolated inside your encrypted vault architecture."
    }
  },
  settings: {
    header: {
      title: "System Settings",
      description: "Configure your neural providers, visual theme, and zero-trust security settings."
    },
    neural: {
      title: "Neural Engine Settings",
      subtitle: "Model & API Keys",
      clientEncrypted: "Client Encrypted",
      description: "MindVault AI utilizes client-side API keys for neural processing. Keys are stored locally in your browser's encrypted storage and are never sent to external application servers.",
      labels: {
        gemini: "Gemini Pro API Key",
        claude: "Claude 3.5 Sonnet Key (Optional)",
        provider: "Preferred Model Provider"
      },
      placeholders: {
        gemini: "AIzaSy...",
        claude: "sk-ant..."
      },
      links: {
        gemini: "Get Gemini Key",
        claude: "Anthropic Console"
      },
      saveBtn: "Save Settings",
      testBtn: "Test Key Connection",
      testing: "Testing...",
      success: "Neural configuration saved to local vault.",
      error: "Neural sync failed.",
      noGeminiKey: "Please enter a Gemini API Key first.",
      testSuccess: "Gemini Neural API Connection Verified! (Status 200 OK)"
    },
    theme: {
      title: "Interface Aesthetics",
      subtitle: "Visual Theme Options",
      light: {
        label: "Luminous Light Mode",
        description: "Clean, high-contrast clarity for daylight reflection."
      },
      dark: {
        label: "Cyber Space Dark Mode",
        description: "Deep, immersive dark aesthetics for mindful focused sessions."
      }
    },
    account: {
      title: "Account Profile",
      verified: "Identity Verified",
      labels: {
        name: "Display Name",
        email: "Email",
        uid: "Neural UID"
      },
      defaultName: "Reflector"
    },
    status: {
      title: "System Status",
      rows: {
        cloud: "Cloud Architecture",
        vault: "Vault Encryption",
        latency: "Neural Latency",
        push: "Push Services"
      },
      values: {
        optimal: "Optimal",
        secured: "Secured",
        active: "Active"
      }
    }
  },
  newJournal: {
    voiceSupportError: "Voice dictation is not supported in this browser. Please use Chrome or Edge.",
    autoVaultSuccess: "Entry securely vaulted.",
    header: {
      backBtn: "Return to Vault",
      title: "Create Reflection",
      focusOn: "Enter Focus Mode",
      focusOff: "Exit Focus Mode",
      dictate: "Voice Dictate",
      listening: "Listening...",
      neuralSync: "Neural Sync",
      vaultEntry: "Vault Entry"
    },
    editor: {
      titlePlaceholder: "Reflection Title...",
      contentPlaceholder: "Begin writing your neural reflection...",
      autoTitle: "Auto-Title",
      moods: ["Happy", "Neutral", "Sad", "Stressed", "Excited", "Productive", "Anxious", "Reflective"],
      encrypted: "End-to-End Encrypted",
      chars: "characters",
      words: "words"
    },
    analysis: {
      tag: "Neural Engine",
      empty: {
        title: "Unlock AI Insights",
        description: "Our neural processor extracts emotional resonance, cognitive nodes, and actionable growth directives from your reflections.",
        button: "Analyze Entry"
      },
      loading: {
        title: "Syncing Neural Nodes",
        description: "Extracting cognitive patterns..."
      },
      summary: "Summary Extraction",
      nodes: "Neural Nodes",
      directive: "Growth Directive"
    }
  },
  about: {
    hero: {
      tag: "Innovation & Privacy",
      title: "About MindVault AI",
      description: "Your thoughts are personal. Your growth should be intelligent."
    },
    mission: {
      title: "Our Mission",
      description1: "MindVault AI is a privacy-first AI journaling platform engineered to empower individuals to understand their thoughts, reflect on their life events, and evolve personally through Gemini & Claude AI models.",
      description2: "We combine AI, client-side encryption, and modern web software to transform everyday reflections into actionable growth insights.",
      boxes: [
        { title: "Zero-Trust Privacy", desc: "100% Client-side isolation" },
        { title: "Neural NLP", desc: "Gemini & Claude Models" },
        { title: "Self Growth", desc: "Cognitive Matrix Graphs" },
        { title: "Instant Performance", desc: "Vite + React Architecture" }
      ]
    },
    architect: {
      title: "Meet the Architect",
      name: "Krishna Patil Rajput",
      role: "Full-Stack Web Developer • AI Systems Engineer",
      bio: "Passionate about engineering applications that blend AI, modern front-end design systems, and secure software architecture for personal empowerment."
    },
    tech: {
      title: "Built With Cutting-Edge Tech"
    }
  }
};
