import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext.tsx';
import { JournalEntry } from '../types.ts';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Lightbulb,
  ListTodo,
  Tag,
  Trash2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';

interface JournalDetailViewProps {
  journal: JournalEntry;
  onBack: () => void;
}

export const JournalDetailView: React.FC<JournalDetailViewProps> = ({ journal, onBack }) => {
  const { toggleActionItem, deleteJournal } = useJournal();
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reflection? This action is permanent and isolated.')) {
      setIsDeleting(true);
      await deleteJournal(journal.id);
      onBack();
    }
  };

  const actionItems = journal.actionItems || [];
  const completedCount = actionItems.filter((a) => a.completed).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      
      {/* Top Bar with navigation and delete */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO REFLECTIONS</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> ISOLATED (UID: {journal.userId.slice(0, 6)}...)
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-1.5 rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2 text-xs font-black uppercase tracking-wider text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>DELETE</span>
          </button>
        </div>
      </div>

      {/* Main Title & Metadata Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          <span>
            {new Date(journal.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
          {journal.title}
        </h1>

        {/* Topics Chips */}
        {journal.topics && journal.topics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {journal.topics.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <Tag className="mr-1.5 h-3 w-3 text-indigo-500" />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Structured Summary */}
      {journal.summary && (
        <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-6 sm:p-8 dark:border-indigo-500/30 dark:bg-indigo-950/20 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>GEMINI SYNTHESIS SUMMARY</span>
          </div>
          <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
            {journal.summary}
          </div>
        </div>
      )}

      {/* Key Insights & Action Items Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Key Insights Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
              KEY INSIGHTS
            </h3>
          </div>

          <div className="space-y-2.5">
            {journal.keyInsights && journal.keyInsights.length > 0 ? (
              journal.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs font-medium leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-black text-amber-600 dark:text-amber-400">
                    {idx + 1}
                  </span>
                  <span>{insight}</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-medium text-slate-400">No specific insights extracted.</p>
            )}
          </div>
        </div>

        {/* Journal-to-Action Checklist Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <ListTodo className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                ACTION PLAN ({completedCount}/{actionItems.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {actionItems.length > 0 ? (
              actionItems.map((action) => (
                <div
                  key={action.id}
                  onClick={() => toggleActionItem(journal.id, action.id)}
                  className="group flex items-start space-x-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs transition-colors hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <button className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {action.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span className={action.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800 dark:text-slate-200'}>
                      {action.text}
                    </span>
                    {action.category && (
                      <span className="mt-1 block text-[10px] uppercase font-black tracking-wider text-indigo-600 dark:text-indigo-400">
                        {action.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-medium text-slate-400">No action items defined for this session.</p>
            )}
          </div>
        </div>

      </div>

      {/* Expandable Conversation Transcript */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-indigo-500" />
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                FULL CONVERSATION TRANSCRIPT
              </h3>
              <p className="text-xs font-medium text-slate-500">
                {journal.conversation.length} message turns recorded in isolated audit log
              </p>
            </div>
          </div>
          {showTranscript ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </button>

        {showTranscript && (
          <div className="border-t border-slate-100 p-6 dark:border-slate-800 space-y-4">
            {journal.conversation.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      isUser ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
