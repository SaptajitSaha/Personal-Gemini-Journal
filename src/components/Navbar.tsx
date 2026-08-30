import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  History,
  PlusCircle,
  LogOut,
  Moon,
  Sun,
  FileText,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'new-journal' | 'history' | 'evolution' | 'security';
  setCurrentTab: (tab: 'dashboard' | 'new-journal' | 'history' | 'evolution' | 'security') => void;
  onOpenDocs: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenDocs,
  darkMode,
  toggleDarkMode,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Security Seal */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                  GEMINI
                </span>
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-slate-500">
                  JOURNAL PRO
                </span>
                <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  <Lock className="mr-1 h-2.5 w-2.5" /> SECURE
                </span>
              </div>
              <p className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:block">
                Hack2Skill APAC GenAI Edition
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <nav className="hidden items-center space-x-1.5 md:flex">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('new-journal')}
              className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                currentTab === 'new-journal'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 ring-2 ring-indigo-500/30'
                  : 'bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ New Entry</span>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </button>

            <button
              onClick={() => setCurrentTab('evolution')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentTab === 'evolution'
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <span className="relative">
                Evolution
                <span className="absolute -top-1 -right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('security')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentTab === 'security'
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Security Center</span>
            </button>
          </nav>
        )}

        {/* Right side controls: Docs, Dark Mode, Profile */}
        <div className="flex items-center space-x-2.5">
          {/* Docs Button */}
          <button
            onClick={onOpenDocs}
            title="View Architecture & Threat Model Documentation"
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Docs & Spec</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Profile & Sign Out */}
          {user ? (
            <div className="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full ring-2 ring-indigo-500/40 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                    {(user.displayName || user.email || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.displayName || 'Journaler'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    UID: {user.uid.slice(0, 8)}...
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="rounded-xl p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile navigation row */}
      {user && (
        <div className="flex border-t border-slate-200 px-2 py-2 overflow-x-auto md:hidden dark:border-slate-800 space-x-1">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('new-journal')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap ${
              currentTab === 'new-journal' ? 'bg-indigo-600 text-white' : 'text-indigo-600 dark:text-indigo-400'
            }`}
          >
            + New Entry
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap ${
              currentTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setCurrentTab('evolution')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap ${
              currentTab === 'evolution' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Evolution
          </button>
          <button
            onClick={() => setCurrentTab('security')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap ${
              currentTab === 'security' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Security
          </button>
        </div>
      )}
    </header>
  );
};
