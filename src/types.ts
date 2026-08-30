export interface JournalMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  category?: 'reflection' | 'task' | 'habit' | 'learning';
}

export interface JournalSummary {
  title: string;
  summary: string;
  keyInsights: string[];
  actionItems: ActionItem[];
  topics: string[];
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  conversation: JournalMessage[];
  summary?: string;
  keyInsights?: string[];
  actionItems?: ActionItem[];
  topics?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReflectionEvolutionTheme {
  theme: string;
  frequency: number;
  trajectory: 'increasing' | 'stable' | 'emerging' | 'completed';
  firstObserved: string;
  latestObserved: string;
  description: string;
}

export interface ReflectionEvolutionGoalTrend {
  period: string;
  focus: string;
  activeGoalsCount: number;
  completedGoalsCount: number;
}

export interface ReflectionEvolution {
  userId: string;
  analyzedJournalsCount: number;
  timeRange: {
    start: string;
    end: string;
  };
  narrativeShift: string;
  recurringThemes: ReflectionEvolutionTheme[];
  recurringGoals: string[];
  recurringActionItems: string[];
  focusShiftSummary: {
    earlyFocus: string[];
    currentFocus: string[];
    growthTrajectory: string;
  };
  generatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}

export interface SecurityStatus {
  firebaseAuthActive: boolean;
  firestoreIsolationEnforced: boolean;
  backendTokenVerification: boolean;
  secretManagerConfigured: boolean;
  inputValidationActive: boolean;
  aiOutputValidationActive: boolean;
  rateLimitingActive: boolean;
  geminiModel: string;
  environment: string;
}
