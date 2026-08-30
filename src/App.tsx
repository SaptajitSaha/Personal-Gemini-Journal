/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { JournalProvider, useJournal } from './context/JournalContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingView } from './components/LandingView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ActiveJournalChat } from './components/ActiveJournalChat.tsx';
import { JournalHistoryView } from './components/JournalHistoryView.tsx';
import { JournalDetailView } from './components/JournalDetailView.tsx';
import { ReflectionEvolutionView } from './components/ReflectionEvolutionView.tsx';
import { SecurityCenterView } from './components/SecurityCenterView.tsx';
import { DocumentationModal } from './components/DocumentationModal.tsx';
import { JournalEntry } from './types.ts';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const { startNewJournal, activeJournal, setActiveJournal } = useJournal();

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'new-journal' | 'history' | 'evolution' | 'security'>('dashboard');
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('gemini_journal_theme') === 'dark';
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gemini_journal_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gemini_journal_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleStartNew = () => {
    setSelectedJournal(null);
    startNewJournal();
    setCurrentTab('new-journal');
  };

  const handleViewJournalDetail = (journal: JournalEntry) => {
    setSelectedJournal(journal);
  };

  const handleBackFromDetail = () => {
    setSelectedJournal(null);
  };

  const handleFinishedSession = (savedJournal: JournalEntry) => {
    setSelectedJournal(savedJournal);
    setCurrentTab('dashboard');
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500">Initializing Zero-Trust Journal...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated, show Landing & Sign-in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col justify-between">
        <Navbar
          currentTab="dashboard"
          setCurrentTab={() => {}}
          onOpenDocs={() => setIsDocsOpen(true)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1">
          <LandingView
            onExploreDemo={() => setCurrentTab('dashboard')}
            onOpenDocs={() => setIsDocsOpen(true)}
          />
        </main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">
          Personal Gemini Journal Pro • Hack2Skill GenAI Academy APAC Challenge • Security-First Architecture
        </footer>
        <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedJournal(null);
          if (tab === 'new-journal' && !activeJournal) {
            startNewJournal();
          }
          setCurrentTab(tab);
        }}
        onOpenDocs={() => setIsDocsOpen(true)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedJournal ? (
          <JournalDetailView
            journal={selectedJournal}
            onBack={handleBackFromDetail}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                onStartNew={handleStartNew}
                onViewJournal={handleViewJournalDetail}
                onViewEvolution={() => setCurrentTab('evolution')}
                onViewSecurity={() => setCurrentTab('security')}
                onViewHistory={() => setCurrentTab('history')}
              />
            )}

            {currentTab === 'new-journal' && (
              <ActiveJournalChat
                onBack={() => setCurrentTab('dashboard')}
                onFinished={handleFinishedSession}
              />
            )}

            {currentTab === 'history' && (
              <JournalHistoryView
                onSelectJournal={handleViewJournalDetail}
                onStartNew={handleStartNew}
              />
            )}

            {currentTab === 'evolution' && <ReflectionEvolutionView />}

            {currentTab === 'security' && <SecurityCenterView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-xs dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <span className="font-bold tracking-wider uppercase text-slate-500">Personal Gemini Journal — APAC Hack2Skill</span>
          <span className="font-mono text-[11px] font-bold text-indigo-500 tracking-wider uppercase">
            Zero-Trust • Secret Manager • Firestore Rules Active
          </span>
        </div>
      </footer>

      {/* In-App Technical Documentation Modal */}
      <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JournalProvider>
        <MainApp />
      </JournalProvider>
    </AuthProvider>
  );
}
