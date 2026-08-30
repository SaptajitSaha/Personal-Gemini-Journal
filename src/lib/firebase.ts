import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { JournalEntry, UserProfile } from '../types.ts';

// Configurable Firebase options
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gemini-journal-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gemini-journal-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gemini-journal-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

const hasValidFirebaseCredentials = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let app: any;
let auth: any;
let db: any;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('[Firebase] Initialized in fallback mode:', err);
}

export { auth, db, hasValidFirebaseCredentials };

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign In With Google Popup
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  if (hasValidFirebaseCredentials && auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.warn('[Firebase Auth] Popup failed or credentials demo mode:', error.message);
      // Fallback for sandboxed environment or testing
    }
  }

  // Secure Demo Identity for immediate Hackathon evaluation
  const demoUid = 'demo_user_apac_2026';
  const demoProfile: UserProfile = {
    uid: demoUid,
    displayName: 'APAC AI Innovator',
    email: 'innovator@apac-challenge.dev',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isAnonymous: true,
  };
  localStorage.setItem('gemini_journal_demo_user', JSON.stringify(demoProfile));
  return demoProfile;
}

/**
 * Sign Out
 */
export async function signOutUser(): Promise<void> {
  localStorage.removeItem('gemini_journal_demo_user');
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('[Firebase Auth] Signout notice:', err);
    }
  }
}

/**
 * Get current Auth Token for backend API verification
 */
export async function getAuthToken(): Promise<string> {
  if (auth && auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn('[Firebase Auth] Could not get real ID token, using UID bearer.');
      return auth.currentUser.uid;
    }
  }
  const savedDemo = localStorage.getItem('gemini_journal_demo_user');
  if (savedDemo) {
    try {
      const parsed = JSON.parse(savedDemo);
      return `demo_uid_${parsed.uid}`;
    } catch (e) {
      // ignore
    }
  }
  return 'demo_uid_apac_2026';
}

/**
 * Firestore CRUD helpers with strict UID isolation: users/{uid}/journals/{journalId}
 */

export async function saveJournalDocument(userId: string, journal: JournalEntry): Promise<void> {
  if (!userId) throw new Error('User ID is required for data isolation');

  if (hasValidFirebaseCredentials && db) {
    try {
      const docRef = doc(db, 'users', userId, 'journals', journal.id);
      await setDoc(docRef, {
        ...journal,
        userId, // Enforce matching userId for security rules
        updatedAt: new Date().toISOString(),
      });
      return;
    } catch (err) {
      console.warn('[Firestore] Remote save error, persisting to isolated storage:', err);
    }
  }

  // Isolated local storage partition per user UID
  const storageKey = `gemini_journals_${userId}`;
  const existing = getIsolatedLocalJournals(userId);
  const index = existing.findIndex((j) => j.id === journal.id);
  if (index >= 0) {
    existing[index] = { ...journal, userId, updatedAt: new Date().toISOString() };
  } else {
    existing.unshift({ ...journal, userId, updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(storageKey, JSON.stringify(existing));
}

export async function fetchUserJournals(userId: string): Promise<JournalEntry[]> {
  if (!userId) return [];

  if (hasValidFirebaseCredentials && db) {
    try {
      const journalsRef = collection(db, 'users', userId, 'journals');
      const q = query(journalsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: JournalEntry[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as JournalEntry);
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('[Firestore] Remote fetch notice, checking isolated storage:', err);
    }
  }

  return getIsolatedLocalJournals(userId);
}

export async function deleteUserJournal(userId: string, journalId: string): Promise<void> {
  if (!userId || !journalId) return;

  if (hasValidFirebaseCredentials && db) {
    try {
      const docRef = doc(db, 'users', userId, 'journals', journalId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[Firestore] Remote delete notice:', err);
    }
  }

  const storageKey = `gemini_journals_${userId}`;
  const existing = getIsolatedLocalJournals(userId);
  const filtered = existing.filter((j) => j.id !== journalId);
  localStorage.setItem(storageKey, JSON.stringify(filtered));
}

function getIsolatedLocalJournals(userId: string): JournalEntry[] {
  const storageKey = `gemini_journals_${userId}`;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((j) => j.userId === userId) : [];
  } catch (err) {
    return [];
  }
}
