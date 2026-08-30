import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (customName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved demo user in localStorage first
    const savedDemo = localStorage.getItem('gemini_journal_demo_user');
    if (savedDemo) {
      try {
        setUser(JSON.parse(savedDemo));
      } catch (err) {
        // ignore
      }
    }

    // Subscribe to Firebase auth if available
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Journaler',
            email: fbUser.email,
            photoURL: fbUser.photoURL,
          });
        } else if (!localStorage.getItem('gemini_journal_demo_user')) {
          setUser(null);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      setUser(profile);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (customName = 'Dev Innovator (APAC)') => {
    const demoProfile: UserProfile = {
      uid: 'demo_user_apac_2026',
      displayName: customName,
      email: 'innovator@apac-challenge.dev',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isAnonymous: true,
    };
    localStorage.setItem('gemini_journal_demo_user', JSON.stringify(demoProfile));
    setUser(demoProfile);
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
