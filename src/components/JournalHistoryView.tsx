import React, { useState, useMemo } from 'react';
import { useJournal } from '../context/JournalContext.tsx';
import { JournalEntry } from '../types.ts';
import {
  Search,
  Calendar,
  Tag,
  ArrowRight,
  Filter,
  CheckCircle2,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface JournalHistoryViewProps {
  onSelectJournal: (journal: JournalEntry) => void;
  onStartNew: () => void;
}

export const JournalHistoryView: React.FC<JournalHistoryViewProps> = ({
  onSelectJournal,
  onStartNew,
}) => {
  const { journals } = useJournal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Collect all unique topics
  const allTopics = useMemo(() => {
    const topicSet = new Set<string>();
    journals.forEach((j) => {
      j.topics?.forEach((t) => topicSet.add(t));
    });
    return Array.from(topicSet);
  }, [journals]);

  // Filter and sort journals
  const filteredJournals = useMemo(() => {
    return journals
      .filter((j) => {
        // Topic filter
        if (selectedTopic && !j.topics?.includes(selectedTopic)) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = j.title.toLowerCase().includes(q);
          const matchSummary = j.summary?.toLowerCase().includes(q) || false;
          const matchTopics = j.topics?.some((t) => t.toLowerCase().includes(q)) || false;
          const matchInsights = j.keyInsights?.some((i) => i.toLowerCase().includes(q)) || false;
          return matchTitle || matchSummary || matchTopics || matchInsights;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [journals, searchQuery, selectedTopic, sortOrder]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            REFLECTION ARCHIVES
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Search and revisit your past reflections, insights, and completed goals.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="flex items-center space-x-2 self-start rounded-full bg-indigo-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ NEW REFLECTION</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reflections by keywords, topics, or insights..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {/* Sort Order */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center space-x-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            <span>{sortOrder === 'desc' ? 'NEWEST FIRST' : 'OLDEST FIRST'}</span>
          </button>
        </div>
      </div>

      {/* Topic Filter Pills */}
      {allTopics.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedTopic === null
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            ALL TOPICS ({journals.length})
          </button>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {/* Journals List */}
      {filteredJournals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <p className="text-sm font-medium text-slate-500">No reflections found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic(null);
            }}
            className="mt-3 text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline cursor-pointer"
          >
            CLEAR FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredJournals.map((journal) => {
            const actionItems = journal.actionItems || [];
            const completedActions = actionItems.filter((a) => a.completed).length;

            return (
              <div
                key={journal.id}
                onClick={() => onSelectJournal(journal)}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      <span>
                        {new Date(journal.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                      {journal.conversation.length} TURNS
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {journal.title}
                  </h3>

                  {journal.summary && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400 font-medium">
                      {journal.summary}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  
                  {/* Action Items Completion Progress */}
                  {actionItems.length > 0 && (
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="flex items-center space-x-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[11px] uppercase tracking-wider">TASKS: {completedActions}/{actionItems.length}</span>
                      </span>
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {Math.round((completedActions / actionItems.length) * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Topics Chips */}
                  {journal.topics && journal.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {journal.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                      {journal.topics.length > 3 && (
                        <span className="text-[10px] font-black text-slate-400">
                          +{journal.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
