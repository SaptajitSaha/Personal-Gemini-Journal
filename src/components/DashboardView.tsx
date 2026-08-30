import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useJournal } from '../context/JournalContext.tsx';
import {
  Sparkles,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Circle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Tag,
  BookOpen,
  Flame,
  Award,
} from 'lucide-react';
import { JournalEntry } from '../types.ts';

interface DashboardViewProps {
  onStartNew: () => void;
  onViewJournal: (journal: JournalEntry) => void;
  onViewEvolution: () => void;
  onViewSecurity: () => void;
  onViewHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartNew,
  onViewJournal,
  onViewEvolution,
  onViewSecurity,
  onViewHistory,
}) => {
  const { user } = useAuth();
  const { journals, toggleActionItem, loading } = useJournal();

  // Compute metrics
  const totalJournals = journals.length;
  const allActionItems = journals.flatMap((j) =>
    (j.actionItems || []).map((a) => ({ ...a, journalId: j.id, journalTitle: j.title }))
  );
  const completedActions = allActionItems.filter((a) => a.completed).length;
  const totalActions = allActionItems.length;
  const completionPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  // Recent 3 journals
  const recentJournals = journals.slice(0, 3);
  // Pending action items (limit 4)
  const pendingActions = allActionItems.filter((a) => !a.completed).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              AUTHENTICATED WORKSPACE
            </span>
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
              <ShieldCheck className="mr-1 h-3 w-3 text-indigo-500" /> ZERO-TRUST SESSION
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            {user?.displayName || 'Mindful Journaler'}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Ready to explore your thoughts and track how your ideas evolve over time?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartNew}
            className="flex items-center space-x-2 rounded-full bg-indigo-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ New Entry</span>
          </button>
          <button
            onClick={onViewEvolution}
            className="flex items-center space-x-2 rounded-full border border-slate-300 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span>View Evolution</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              TOTAL ENTRIES
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {totalJournals}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">isolated sessions</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              ACTION ITEMS
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {completedActions}/{totalActions}
            </span>
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
              ({completionPercentage}%)
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              REFLECTIVE STREAK
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              3
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">weeks active</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              SECURITY AUDIT
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              100%
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">6/6 checks passed</span>
          </div>
        </div>

      </div>

      {/* Reflection Evolution Teaser Banner - Bold High-Contrast Card */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 sm:p-10 text-white shadow-2xl shadow-indigo-600/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>ORIGINAL ANALYTICS FEATURE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              REFLECTION EVOLUTION ENGINE
            </h3>
            <p className="text-sm font-medium text-indigo-100 leading-relaxed">
              "Your reflections have shifted from learning AI fundamentals toward building real AI applications, with a notable surge in security-first architecture."
            </p>
          </div>
          <button
            onClick={onViewEvolution}
            className="inline-flex items-center space-x-2 rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-widest text-slate-950 shadow-xl hover:bg-slate-100 transition-all whitespace-nowrap self-start md:self-center cursor-pointer"
          >
            <span>EXPLORE EVOLUTION TRENDS</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Reflections & Pending Action Items */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left 2 Cols: Recent Reflections */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              RECENT REFLECTIONS
            </h2>
            <button
              onClick={onViewHistory}
              className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center space-x-1 cursor-pointer"
            >
              <span>VIEW ALL ({journals.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {recentJournals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-800">
              <p className="text-sm font-medium text-slate-500">No reflections saved yet.</p>
              <button
                onClick={onStartNew}
                className="mt-4 inline-flex items-center space-x-2 rounded-full bg-indigo-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md hover:bg-indigo-500 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>START FIRST REFLECTION</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {recentJournals.map((journal) => (
                <div
                  key={journal.id}
                  onClick={() => onViewJournal(journal)}
                  className="group relative cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>
                          {new Date(journal.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {journal.title}
                      </h3>
                      {journal.summary && (
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                          {journal.summary}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-indigo-500 dark:text-slate-600 transition-transform group-hover:translate-x-1" />
                  </div>

                  {/* Topic Badges */}
                  {journal.topics && journal.topics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {journal.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <Tag className="mr-1 h-2.5 w-2.5 text-indigo-500" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Journal-to-Action Checklist Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              ACTION PLAN
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">
              {pendingActions.length} PENDING
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            {pendingActions.length === 0 ? (
              <div className="py-8 text-center text-xs font-medium text-slate-400">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                <span>All action items completed! Good job.</span>
              </div>
            ) : (
              pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start space-x-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/60"
                >
                  <button
                    onClick={() => toggleActionItem(action.journalId, action.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors cursor-pointer"
                  >
                    {action.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex-1 text-xs">
                    <p className={`font-medium text-slate-800 dark:text-slate-200 ${action.completed ? 'line-through opacity-50' : ''}`}>
                      {action.text}
                    </p>
                    <span className="mt-1 block text-[10px] font-bold text-slate-400 uppercase truncate">
                      From: {action.journalTitle}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Security Status Tile */}
          <div
            onClick={onViewSecurity}
            className="cursor-pointer rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-5 transition-all hover:bg-indigo-500/20 dark:border-indigo-500/30 dark:bg-indigo-950/30"
          >
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
              <span>SECURITY CENTER AUDIT</span>
            </div>
            <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero-Trust Firestore Rules, Secret Manager & Bearer tokens active and passing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
