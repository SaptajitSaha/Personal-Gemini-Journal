import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { JournalEntry, JournalMessage, ReflectionEvolution, ActionItem } from '../types.ts';
import { useAuth } from './AuthContext.tsx';
import {
  fetchUserJournals,
  saveJournalDocument,
  deleteUserJournal,
} from '../lib/firebase.ts';
import {
  sendChatMessage,
  summarizeConversation,
  fetchReflectionEvolution,
} from '../lib/api.ts';

interface JournalContextType {
  journals: JournalEntry[];
  activeJournal: JournalEntry | null;
  loading: boolean;
  isSendingMessage: boolean;
  isSummarizing: boolean;
  evolution: ReflectionEvolution | null;
  isAnalyzingEvolution: boolean;
  startNewJournal: () => void;
  setActiveJournal: (journal: JournalEntry | null) => void;
  sendMessage: (text: string) => Promise<void>;
  finishAndSaveActiveJournal: () => Promise<JournalEntry | null>;
  deleteJournal: (id: string) => Promise<void>;
  toggleActionItem: (journalId: string, actionId: string) => Promise<void>;
  refreshEvolution: () => Promise<void>;
  seedDemoJournals: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

// High-quality initial seed reflections illustrating realistic evolution over weeks
const INITIAL_DEMO_JOURNALS = (userId: string): JournalEntry[] => [
  {
    id: 'journal-seed-1',
    userId,
    title: 'Exploring AI & Prompt Engineering Fundamentals',
    conversation: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'I started learning more about the Gemini API today. Feeling a bit overwhelmed by how fast generative models are moving, but eager to understand system instructions and zero-shot prompting.',
        timestamp: '2026-08-01T10:15:00.000Z',
      },
      {
        id: 'msg-2',
        sender: 'gemini',
        text: 'It is completely natural to feel the rapid pace of AI advancement. Focusing on core fundamentals like clear system instructions and structured prompting gives you an enduring foundation. What specific concept did you find most intriguing today?',
        timestamp: '2026-08-01T10:15:30.000Z',
      },
      {
        id: 'msg-3',
        sender: 'user',
        text: 'I really liked how deterministic JSON schemas can constrain LLM outputs. I want to build a small habit around practicing AI prompt architectures every morning.',
        timestamp: '2026-08-01T10:17:00.000Z',
      },
    ],
    summary: 'The user began their journey exploring Google GenAI fundamentals, overcoming initial overwhelm by grounding their learning in structured schemas and disciplined daily study.',
    keyInsights: [
      'Structured JSON schemas significantly reduce model hallucinations.',
      'Daily morning practice builds high-confidence AI intuition.',
    ],
    actionItems: [
      { id: 'act-s1-1', text: 'Experiment with Zod validation on Gemini response schemas', completed: true, category: 'learning' },
      { id: 'act-s1-2', text: 'Set up daily 20-minute prompt architecture review', completed: true, category: 'habit' },
    ],
    topics: ['AI Fundamentals', 'Prompt Engineering', 'Structured JSON', 'Learning Habits'],
    createdAt: '2026-08-01T10:20:00.000Z',
    updatedAt: '2026-08-01T10:20:00.000Z',
  },
  {
    id: 'journal-seed-2',
    userId,
    title: 'Architecting Secure Full-Stack Boundaries',
    conversation: [
      {
        id: 'msg-4',
        sender: 'user',
        text: 'Reflecting on application security today. Many web apps leak API keys in client bundles. I spent the afternoon configuring Google Cloud Secret Manager and designing server-side proxies for all Gemini requests.',
        timestamp: '2026-08-14T14:30:00.000Z',
      },
      {
        id: 'msg-5',
        sender: 'gemini',
        text: 'Establishing strong architectural boundaries early is a hallmark of senior engineering. Keeping secrets in Secret Manager and enforcing backend authorization protects user privacy and prevents credential leaks. How did you structure your token validation?',
        timestamp: '2026-08-14T14:31:00.000Z',
      },
      {
        id: 'msg-6',
        sender: 'user',
        text: 'I implemented Firebase ID token verification in Express middleware and strict Firestore security rules isolating each user to users/{uid}/journals/{journalId}.',
        timestamp: '2026-08-14T14:33:00.000Z',
      },
    ],
    summary: 'A deep focus on production-grade application security, moving beyond prototyping into enterprise security practices including Secret Manager, Firebase Token authorization, and zero-trust Firestore isolation.',
    keyInsights: [
      'Client-side security is an illusion; all API keys and tokens must be verified server-side.',
      'Firestore path-level security rules guarantee ironclad multi-tenant isolation.',
    ],
    actionItems: [
      { id: 'act-s2-1', text: 'Audit firestore.rules to ensure default deny on all collections', completed: true, category: 'task' },
      { id: 'act-s2-2', text: 'Implement sliding window rate limiting on AI endpoints', completed: true, category: 'task' },
    ],
    topics: ['App Security', 'Secret Manager', 'Firestore Rules', 'Authorization'],
    createdAt: '2026-08-14T14:35:00.000Z',
    updatedAt: '2026-08-14T14:35:00.000Z',
  },
  {
    id: 'journal-seed-3',
    userId,
    title: 'Building Production AI Applications for Hack2Skill APAC',
    conversation: [
      {
        id: 'msg-7',
        sender: 'user',
        text: 'Excited about the APAC GenAI Academy challenge. I have transitioned from passive learning to building a full-blown Personal Gemini Journal. I want to add an original "Reflection Evolution" engine that analyzes trends across past reflections.',
        timestamp: '2026-08-28T09:00:00.000Z',
      },
      {
        id: 'msg-8',
        sender: 'gemini',
        text: 'That is a profound shift: moving from theory to shipping real, impactful AI products. Reflection Evolution turns static journal entries into an active mirror of personal growth. How do you plan to visualize these theme trajectories?',
        timestamp: '2026-08-28T09:01:00.000Z',
      },
      {
        id: 'msg-9',
        sender: 'user',
        text: 'I will compute chronological narrative shifts, recurring goal completions, and dynamic focus shifts. It proves that continuous reflection drives tangible execution.',
        timestamp: '2026-08-28T09:03:00.000Z',
      },
    ],
    summary: 'The culmination of the learning journey: building a production-ready web application with deep personalization, Reflection Evolution analytics, and actionable task tracking.',
    keyInsights: [
      'Reflection becomes exponentially more valuable when longitudinal trends and mindset shifts are synthesized over time.',
      'Coupling AI insights with actionable task check-offs turns reflections into real habits.',
    ],
    actionItems: [
      { id: 'act-s3-1', text: 'Build responsive dashboard visualizing Reflection Evolution shifts', completed: false, category: 'task' },
      { id: 'act-s3-2', text: 'Run automated end-to-end security verification tests', completed: false, category: 'task' },
    ],
    topics: ['Production AI', 'Reflection Evolution', 'APAC Hackathon', 'Actionable Growth'],
    createdAt: '2026-08-28T09:05:00.000Z',
    updatedAt: '2026-08-28T09:05:00.000Z',
  },
];

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activeJournal, setActiveJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [evolution, setEvolution] = useState<ReflectionEvolution | null>(null);
  const [isAnalyzingEvolution, setIsAnalyzingEvolution] = useState(false);

  // Load journals when user changes
  const loadJournals = useCallback(async () => {
    if (!user) {
      setJournals([]);
      setActiveJournal(null);
      setEvolution(null);
      return;
    }

    setLoading(true);
    try {
      let data = await fetchUserJournals(user.uid);
      if (data.length === 0) {
        // Automatically provide rich initial seed data for immediate demonstration
        const seed = INITIAL_DEMO_JOURNALS(user.uid);
        for (const item of seed) {
          await saveJournalDocument(user.uid, item);
        }
        data = seed;
      }
      setJournals(data);
    } catch (err) {
      console.error('Error loading journals:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadJournals();
  }, [loadJournals]);

  // Start new active journal session
  const startNewJournal = () => {
    if (!user) return;
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      userId: user.uid,
      title: 'Untitled Reflection',
      conversation: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'gemini',
          text: 'Hello! I am your Gemini journaling companion. What is on your mind today? Whether it is celebrating a milestone, navigating a challenge, or exploring an idea, I am here with you.',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveJournal(newEntry);
  };

  // Send message in active chat
  const sendMessage = async (text: string) => {
    if (!activeJournal || !text.trim() || isSendingMessage) return;

    const userMsg: JournalMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedConversation = [...activeJournal.conversation, userMsg];
    const updatedJournal: JournalEntry = {
      ...activeJournal,
      conversation: updatedConversation,
      updatedAt: new Date().toISOString(),
    };
    setActiveJournal(updatedJournal);
    setIsSendingMessage(true);

    try {
      const replyText = await sendChatMessage(
        activeJournal.conversation.map((m) => ({ sender: m.sender, text: m.text })),
        text.trim()
      );

      const geminiMsg: JournalMessage = {
        id: `msg-gemini-${Date.now()}`,
        sender: 'gemini',
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      const finalJournal: JournalEntry = {
        ...updatedJournal,
        conversation: [...updatedConversation, geminiMsg],
        updatedAt: new Date().toISOString(),
      };

      setActiveJournal(finalJournal);
      // Auto-save draft
      if (user) {
        await saveJournalDocument(user.uid, finalJournal);
      }
    } catch (err: any) {
      console.error('Error in chat:', err);
      // Add error message to conversation for clarity
      const errorMsg: JournalMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'gemini',
        text: `(Notice: ${err.message || 'Could not connect to Gemini backend. Check your connection.'})`,
        timestamp: new Date().toISOString(),
      };
      setActiveJournal({
        ...updatedJournal,
        conversation: [...updatedConversation, errorMsg],
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Finish session and generate structured AI summary
  const finishAndSaveActiveJournal = async (): Promise<JournalEntry | null> => {
    if (!activeJournal || !user) return null;

    setIsSummarizing(true);
    try {
      const summaryResult = await summarizeConversation(activeJournal.conversation);

      const finalized: JournalEntry = {
        ...activeJournal,
        title: summaryResult.title || activeJournal.title,
        summary: summaryResult.summary,
        keyInsights: summaryResult.keyInsights,
        actionItems: summaryResult.actionItems,
        topics: summaryResult.topics,
        updatedAt: new Date().toISOString(),
      };

      await saveJournalDocument(user.uid, finalized);

      setJournals((prev) => {
        const filtered = prev.filter((j) => j.id !== finalized.id);
        return [finalized, ...filtered];
      });

      setActiveJournal(finalized);
      return finalized;
    } catch (err) {
      console.error('Summarization error:', err);
      // Fallback save without AI summary
      await saveJournalDocument(user.uid, activeJournal);
      return activeJournal;
    } finally {
      setIsSummarizing(false);
    }
  };

  // Delete journal
  const deleteJournal = async (id: string) => {
    if (!user) return;
    try {
      await deleteUserJournal(user.uid, id);
      setJournals((prev) => prev.filter((j) => j.id !== id));
      if (activeJournal?.id === id) {
        setActiveJournal(null);
      }
    } catch (err) {
      console.error('Error deleting journal:', err);
    }
  };

  // Toggle Action Item completion
  const toggleActionItem = async (journalId: string, actionId: string) => {
    if (!user) return;

    const targetJournal = journals.find((j) => j.id === journalId);
    if (!targetJournal || !targetJournal.actionItems) return;

    const updatedActions = targetJournal.actionItems.map((action) =>
      action.id === actionId ? { ...action, completed: !action.completed } : action
    );

    const updatedJournal: JournalEntry = {
      ...targetJournal,
      actionItems: updatedActions,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setJournals((prev) => prev.map((j) => (j.id === journalId ? updatedJournal : j)));
    if (activeJournal?.id === journalId) {
      setActiveJournal(updatedJournal);
    }

    try {
      await saveJournalDocument(user.uid, updatedJournal);
    } catch (err) {
      console.error('Error persisting action item toggle:', err);
    }
  };

  // Compute or refresh Reflection Evolution analysis
  const refreshEvolution = async () => {
    if (!user || journals.length === 0) return;

    setIsAnalyzingEvolution(true);
    try {
      const evo = await fetchReflectionEvolution(journals);
      setEvolution(evo);
    } catch (err) {
      console.error('Evolution error:', err);
    } finally {
      setIsAnalyzingEvolution(false);
    }
  };

  // Reset or re-seed sample journals
  const seedDemoJournals = async () => {
    if (!user) return;
    const seed = INITIAL_DEMO_JOURNALS(user.uid);
    for (const item of seed) {
      await saveJournalDocument(user.uid, item);
    }
    setJournals(seed);
  };

  return (
    <JournalContext.Provider
      value={{
        journals,
        activeJournal,
        loading,
        isSendingMessage,
        isSummarizing,
        evolution,
        isAnalyzingEvolution,
        startNewJournal,
        setActiveJournal,
        sendMessage,
        finishAndSaveActiveJournal,
        deleteJournal,
        toggleActionItem,
        refreshEvolution,
        seedDemoJournals,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
