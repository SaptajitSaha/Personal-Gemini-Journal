import React, { useEffect } from 'react';
import { useJournal } from '../context/JournalContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  TrendingUp,
  Sparkles,
  RefreshCw,
  Layers,
  Target,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Zap,
  Flame,
  Clock,
  Compass,
} from 'lucide-react';

export const ReflectionEvolutionView: React.FC = () => {
  const { user } = useAuth();
  const {
    journals,
    evolution,
    isAnalyzingEvolution,
    refreshEvolution,
  } = useJournal();

  useEffect(() => {
    if (!evolution && journals.length > 0) {
      refreshEvolution();
    }
  }, [evolution, journals.length, refreshEvolution]);

  const trajectoryColors: Record<string, string> = {
    increasing: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    emerging: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    stable: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    completed: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header with Title and Re-analyze */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <Sparkles className="mr-1 h-3 w-3 text-indigo-600 dark:text-indigo-400" /> ORIGINAL ANALYTICS FEATURE
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-mono font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <ShieldCheck className="mr-1 h-3 w-3 text-indigo-500" /> UID: {user?.uid.slice(0, 8)}...
            </span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            REFLECTION EVOLUTION ENGINE
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Synthesizing recurring themes, goal trajectories, and mindset shifts across your reflection history.
          </p>
        </div>

        <button
          onClick={refreshEvolution}
          disabled={isAnalyzingEvolution || journals.length === 0}
          className="flex items-center space-x-2 self-start rounded-full bg-indigo-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzingEvolution ? 'animate-spin' : ''}`} />
          <span>{isAnalyzingEvolution ? 'SYNTHESIZING...' : 'RE-ANALYZE TRENDS'}</span>
        </button>
      </div>

      {/* Hero Narrative Shift Callout Card */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 sm:p-10 text-white shadow-2xl shadow-indigo-600/30">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
            <Compass className="h-3.5 w-3.5" />
            <span>LONGITUDINAL MINDSET TRAJECTORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            {evolution?.narrativeShift ||
              'Your reflections have shifted from learning AI fundamentals toward building real AI applications, with an increasing focus on zero-trust security and habit consistency.'}
          </h2>
          <div className="flex items-center space-x-4 pt-2 text-xs font-bold uppercase tracking-wider text-indigo-200">
            <span className="flex items-center space-x-1.5">
              <Calendar className="h-3.5 w-3.5 text-white" />
              <span>{journals.length} REFLECTIONS ANALYZED</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-white" />
              <span>CHRONOLOGICAL PROGRESSION</span>
            </span>
          </div>
        </div>
      </div>

      {/* Comparative Focus Shift: Early Focus vs Current Focus */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                FOCUS SHIFT DYNAMICS
              </h3>
              <p className="text-xs font-medium text-slate-500">
                How your primary thinking areas shifted between early reflections and current reflections
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Early Focus */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              EARLY REFLECTIONS FOCUS
            </span>
            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {(evolution?.focusShiftSummary?.earlyFocus || [
                'AI Fundamentals & Prompt Engineering concepts',
                'Understanding Gemini system instructions & output schemas',
                'Overcoming initial technical overwhelm through small daily habits',
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Focus */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 dark:border-indigo-500/40 dark:bg-indigo-950/30 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              CURRENT REFLECTIONS FOCUS
            </span>
            <ul className="space-y-2 text-xs text-slate-900 dark:text-slate-100">
              {(evolution?.focusShiftSummary?.currentFocus || [
                'Full-stack production security & Secret Manager integration',
                'Building live applications for the Hack2Skill APAC GenAI challenge',
                'Reflection Evolution analytics and measurable habit completion',
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Growth Trajectory synthesis */}
        {evolution?.focusShiftSummary?.growthTrajectory && (
          <div className="rounded-2xl bg-slate-100 p-4 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white">TRAJECTORY SUMMARY: </span>
            {evolution.focusShiftSummary.growthTrajectory}
          </div>
        )}
      </div>

      {/* Recurring Themes & Trajectories Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left 2 Cols: Recurring Themes & Trajectories */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                RECURRING THEMES & VELOCITY
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Topics recurring with high frequency and their trajectory direction
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {(evolution?.recurringThemes || [
              {
                theme: 'Production App Security & Zero-Trust',
                frequency: 3,
                trajectory: 'increasing',
                firstObserved: '2026-08-01',
                latestObserved: '2026-08-28',
                description: 'Steadily increasing focus on Firebase Token auth, Secret Manager, and Firestore Rules.',
              },
              {
                theme: 'Generative AI & Gemini API Architecture',
                frequency: 3,
                trajectory: 'stable',
                firstObserved: '2026-08-01',
                latestObserved: '2026-08-28',
                description: 'Core architectural foundation across all project milestones.',
              },
              {
                theme: 'Longitudinal Reflection & Habit Tracking',
                frequency: 2,
                trajectory: 'emerging',
                firstObserved: '2026-08-14',
                latestObserved: '2026-08-28',
                description: 'Emerging discipline of turning AI reflections into tangible checked-off action items.',
              },
            ]).map((themeItem, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-tight text-slate-900 dark:text-white text-sm">
                    {themeItem.theme}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      trajectoryColors[themeItem.trajectory] || trajectoryColors.stable
                    }`}
                  >
                    {themeItem.trajectory}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {themeItem.description}
                </p>

                {/* Visual frequency indicator */}
                <div className="flex items-center space-x-2 pt-1">
                  <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, (themeItem.frequency / Math.max(1, journals.length)) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {themeItem.frequency} SESSIONS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recurring Goals & Action Habits */}
        <div className="space-y-6">
          
          {/* Recurring Goals Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                RECURRING GOALS
              </h3>
            </div>

            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {(evolution?.recurringGoals || [
                'Mastering production-grade Gemini 2.5 patterns',
                'Zero client-side secret exposure (Secret Manager)',
                'Building the Personal Gemini Journal for APAC Hack2Skill',
              ]).map((goal, i) => (
                <li key={i} className="flex items-start space-x-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Habits Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                RECURRING HABITS
              </h3>
            </div>

            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {(evolution?.recurringActionItems || [
                'Daily prompt architecture and Zod schema review',
                'Continuous automated security rule auditing',
                'Checking off reflective action items to close the execution loop',
              ]).map((action, i) => (
                <li key={i} className="flex items-start space-x-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                  <Zap className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
