import React, { useState, useRef, useEffect } from 'react';
import { useJournal } from '../context/JournalContext.tsx';
import {
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Bot,
  User,
  Shield,
  Loader2,
  Lightbulb,
  Info,
} from 'lucide-react';
import { JournalEntry } from '../types.ts';

interface ActiveJournalChatProps {
  onBack: () => void;
  onFinished: (journal: JournalEntry) => void;
}

const PROMPT_SUGGESTIONS = [
  'What went well today and why?',
  'I am trying to make a difficult decision...',
  'Reflecting on my habits and consistency...',
  'Brainstorming next steps for my AI project',
  'How can I improve my technical architecture?',
];

export const ActiveJournalChat: React.FC<ActiveJournalChatProps> = ({ onBack, onFinished }) => {
  const {
    activeJournal,
    sendMessage,
    isSendingMessage,
    finishAndSaveActiveJournal,
    isSummarizing,
  } = useJournal();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeJournal?.conversation, isSendingMessage]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSendingMessage) return;
    const msg = inputMessage;
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFinish = async () => {
    const finalized = await finishAndSaveActiveJournal();
    if (finalized) {
      onFinished(finalized);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-5xl flex-col px-4 py-4 sm:px-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                ACTIVE REFLECTION SESSION
              </h2>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                <Lock className="mr-1 h-2.5 w-2.5" /> ISOLATED
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Multi-turn reflection streamed through zero-trust backend proxy.
            </p>
          </div>
        </div>

        {/* Action: Finish & Summarize */}
        <button
          onClick={handleFinish}
          disabled={isSummarizing || isSendingMessage || (activeJournal?.conversation.length || 0) < 2}
          className="flex items-center space-x-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isSummarizing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>SYNTHESIZING...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>FINISH & SYNTHESIZE</span>
            </>
          )}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        
        {/* Supportive Medical/Clinical Disclaimer Banner */}
        <div className="mx-auto flex max-w-2xl items-center space-x-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          <Info className="h-4 w-4 flex-shrink-0 text-indigo-500" />
          <span>
            Gemini is a mindful reflection companion and brainstorming partner; it does not provide clinical diagnosis or psychiatric therapy.
          </span>
        </div>

        {/* Conversation List */}
        {activeJournal?.conversation.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-black shadow-sm ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-indigo-600 text-white shadow-indigo-600/20 ring-2 ring-indigo-500/30'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-xl rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-tr-none'
                    : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`mt-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    isUser ? 'text-slate-300 dark:text-slate-500 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isSendingMessage && (
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"></div>
              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-slate-400">Gemini is reflecting...</span>
            </div>
          </div>
        )}

        {/* Summarizing Overlay Status */}
        {isSummarizing && (
          <div className="rounded-3xl border border-indigo-500/30 bg-indigo-50 p-8 text-center shadow-xl dark:bg-slate-900 dark:border-indigo-500/40">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-indigo-600 dark:text-indigo-400" />
            <h3 className="mt-4 text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              GENERATING STRUCTURED SYNTHESIS & ACTION ITEMS
            </h3>
            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              Gemini is extracting insights, action takeaways, and topic keywords with Zod schema validation...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips (if early in session) */}
      {(activeJournal?.conversation.length || 0) <= 2 && (
        <div className="py-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-indigo-500" />
            <span>INSPIRATION PROMPTS:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(prompt);
                  textareaRef.current?.focus();
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="relative mt-2">
        <div className="relative flex items-end rounded-3xl border border-slate-300 bg-white p-2.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reflect openly... Press Enter to send, Shift+Enter for new line"
            className="flex-1 resize-none bg-transparent px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSendingMessage}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer ml-2"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
          <span>TREATED AS UNTRUSTED USER INPUT (PROMPT INJECTION DEFENSE ACTIVE)</span>
          <span className="font-mono">{inputMessage.length}/3000 CHARS</span>
        </div>
      </form>

    </div>
  );
};
