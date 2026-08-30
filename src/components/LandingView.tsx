import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Database,
  KeyRound,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';

interface LandingViewProps {
  onExploreDemo: () => void;
  onOpenDocs: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onExploreDemo, onOpenDocs }) => {
  const { login, demoLogin, loading } = useAuth();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        
        {/* Hackathon Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>HACK2SKILL GENAI ACADEMY APAC CHALLENGE</span>
            <span className="text-indigo-400">•</span>
            <span className="font-mono">SECURITY-FIRST ARCHITECTURE</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mt-8 text-center space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
            PERSONAL GEMINI <span className="text-indigo-600 dark:text-indigo-500">JOURNAL</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl font-normal leading-relaxed text-slate-600 dark:text-slate-300">
            A private, production-grade journaling companion powered by Firebase and Gemini.
            Engineered with strict zero-trust isolation, automated structured synthesis, and our signature{' '}
            <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Reflection Evolution</span>{' '}
            analytics engine.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => login()}
            disabled={loading}
            className="flex w-full sm:w-auto items-center justify-center space-x-3 rounded-full bg-slate-900 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-xl hover:bg-indigo-600 focus:outline-none dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-white transition-all transform active:scale-98 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>SIGN IN WITH GOOGLE</span>
          </button>

          <button
            onClick={() => {
              demoLogin('APAC AI Evaluator');
              onExploreDemo();
            }}
            className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-full bg-indigo-600 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>LAUNCH DEMO SESSION</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenDocs}
            className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <span>THREAT MODEL</span>
          </button>
        </div>

        {/* Security Pillars Cards */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Fingerprint className="h-6 w-6" />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              PILLAR 01
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Firebase Identity Layer
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Zero trust client IDs. Authentication tokens are verified server-side on every protected API endpoint before any model interactions.
            </p>
            <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> ID Token Authorization
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Database className="h-6 w-6" />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
              PILLAR 02
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Firestore Path-Level Isolation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Data organized under <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">users/&#123;uid&#125;/journals/&#123;id&#125;</code> with hardened Firestore Security Rules forbidding cross-tenant access.
            </p>
            <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Strict Ownership Verification
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              PILLAR 03
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Secret Manager & Server-Only
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Gemini API keys never leak into browser bundles or VITE environment variables. Backend accesses secrets securely with rate limiting.
            </p>
            <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> No Client Key Exposure
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
              PILLAR 04
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Multi-Turn Gemini Companion
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Conversational journaling with defensive system instructions. Automatically extracts structured title, summary, key insights, and action items.
            </p>
            <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Zod Validated Schemas
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              PILLAR 05
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Reflection Evolution Engine
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Analyzes the user's chronological journal corpus to synthesize thematic shifts (e.g. from learning basics to shipping AI systems), recurring goals, and habit trajectories.
            </p>
            <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Longitudinal Synthesis
            </div>
          </div>

          {/* Card 6 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
              <Lock className="h-6 w-6" />
            </div>
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
              PILLAR 06
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Journal-to-Action Tracker
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Extracted actionable steps with interactive check-offs that persist straight to Firestore. Closes the loop from mindfulness to execution.
            </p>
            <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Persistent Action State
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
