import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Shield,
  Layers,
  KeyRound,
  Database,
  TrendingUp,
  Cpu,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeDocTab, setActiveDocTab] = useState<'architecture' | 'security' | 'evolution' | 'rules'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                SECURITY & ARCHITECTURE SPECIFICATION
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Hack2Skill GenAI Academy APAC Challenge Submission
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveDocTab('architecture')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
              activeDocTab === 'architecture'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveDocTab('security')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
              activeDocTab === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Security & Threat Model
          </button>
          <button
            onClick={() => setActiveDocTab('evolution')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
              activeDocTab === 'evolution'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Reflection Evolution
          </button>
          <button
            onClick={() => setActiveDocTab('rules')}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
              activeDocTab === 'rules'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Firestore Rules
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-4 font-medium">
          
          {activeDocTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                1. Production System Architecture
              </h3>
              <p>
                The application is engineered as a defense-in-depth full-stack platform separating untrusted client code from privileged AI and credential execution:
              </p>
              
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                [Client Browser (React SPA)] <br />
                &nbsp;&nbsp;&nbsp;│ <br />
                &nbsp;&nbsp;&nbsp;├── 1. Firebase Auth (Google Sign-In / ID Tokens) <br />
                &nbsp;&nbsp;&nbsp;├── 2. Direct Isolated Firestore CRUD: users/&#123;uid&#125;/journals/&#123;id&#125; (Rules Enforced) <br />
                &nbsp;&nbsp;&nbsp;└── 3. API Requests (Authorization: Bearer &lt;ID_TOKEN&gt;) <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼ <br />
                [Node.js Express Secure Backend] <br />
                &nbsp;&nbsp;&nbsp;├── Security Middleware (Token Verification + Rate Limiting + Sanitization) <br />
                &nbsp;&nbsp;&nbsp;├── Secret Manager Gateway (Privileged GEMINI_API_KEY) <br />
                &nbsp;&nbsp;&nbsp;├── Gemini 2.5 Multi-Turn Conversation Proxy <br />
                &nbsp;&nbsp;&nbsp;├── Automated Summarization &amp; Zod Schema Validator <br />
                &nbsp;&nbsp;&nbsp;└── Reflection Evolution Longitudinal Engine <br />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white">Frontend Layer:</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">React 19 + TypeScript, Tailwind CSS, Lucide icons, Motion animations, and Firebase Auth client.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white">Backend Layer:</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">Node.js Express server, Google GenAI SDK (@google/genai), Google Cloud Secret Manager, Zod validation.</p>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                2. Security Model & STRIDE Defense
              </h3>
              <p>
                Every layer implements fail-closed controls to eliminate vulnerabilities identified in the threat model:
              </p>

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <strong className="font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">1. Zero Client Key Exposure: </strong>
                  The Gemini API key is never bundled in frontend JavaScript, never exposed through VITE_ variables, and retrieved exclusively via Secret Manager on the server.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <strong className="font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">2. Token Verification & Authorization: </strong>
                  Client-provided UIDs are never accepted as proof of identity. The backend verifies cryptographic Bearer tokens.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <strong className="font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">3. Prompt Injection Defense: </strong>
                  System instructions strictly isolate trusted instructions from untrusted user reflections, blocking prompt escape and instruction overrides.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <strong className="font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">4. AI Output Validation: </strong>
                  Structured JSON outputs are parsed and checked against rigid Zod schemas before persistence, discarding unexpected model fields.
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'evolution' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                3. Original Feature: "Reflection Evolution"
              </h3>
              <p>
                Unlike conventional journals that treat reflections as isolated text silos, <strong>Reflection Evolution</strong> synthesizes longitudinal personal growth across the user's chronological corpus:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Mindset Shift Narrative:</strong> Detects macro-level changes in philosophy (e.g. from learning theory to executing production AI software).</li>
                <li><strong>Thematic Trajectory Analysis:</strong> Classifies recurring topics by velocity (increasing, stable, emerging, completed).</li>
                <li><strong>Goal & Action Habit Convergence:</strong> Synthesizes recurring commitments and pairs them with interactive, persistent completion check-offs.</li>
                <li><strong>Zero Cross-User Contamination:</strong> The engine is strictly bounded to the authenticated subject's isolated UID.</li>
              </ul>
            </div>
          )}

          {activeDocTab === 'rules' && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                4. Firestore Production Security Rules (Default Deny)
              </h3>
              <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-indigo-300 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isAuthenticated() {
      return request.auth != null && request.auth.uid != null;
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId}/journals/{journalId} {
      allow read, delete: if isOwner(userId);
      allow create: if isOwner(userId)
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.keys().hasAll(['userId', 'title', 'conversation', 'createdAt', 'updatedAt'])
        && request.resource.data.title.size() <= 300
        && request.resource.data.conversation.size() <= 100;
      allow update: if isOwner(userId)
        && request.resource.data.userId == resource.data.userId
        && request.resource.data.createdAt == resource.data.createdAt;
    }
  }
}`}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            COMPLIANT WITH HACK2SKILL APAC SECURITY CONSTITUTION
          </span>
          <button
            onClick={onClose}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Close Spec
          </button>
        </div>

      </div>
    </div>
  );
};
