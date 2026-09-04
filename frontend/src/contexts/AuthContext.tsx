import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword as fbSignIn,
  createUserWithEmailAndPassword as fbSignUp
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export interface LocalUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export type AuthUser = FirebaseUser | LocalUser;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'mindvault_local_user_v1';
const REGISTERED_USERS_KEY = 'mindvault_registered_users_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get local registered accounts
  const getLocalAccounts = (): { email: string; pass: string; uid: string; displayName: string }[] => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper to save local registered account
  const saveLocalAccount = (acc: { email: string; pass: string; uid: string; displayName: string }) => {
    try {
      const accounts = getLocalAccounts();
      const existingIdx = accounts.findIndex(a => a.email.toLowerCase() === acc.email.toLowerCase());
      if (existingIdx !== -1) {
        accounts[existingIdx] = acc;
      } else {
        accounts.push(acc);
      }
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
    } catch (err) {
      console.warn('Failed to save local account:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        localStorage.setItem('user_profile_name', fbUser.displayName || fbUser.email?.split('@')[0] || 'Vault User');
      } else {
        // Check local storage for persistent user session
        try {
          const storedLocal = localStorage.getItem(LOCAL_USER_KEY);
          if (storedLocal) {
            setUser(JSON.parse(storedLocal));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('user_profile_name', res.user.displayName || 'Vault User');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (emailStr: string, passStr: string) => {
    const cleanEmail = emailStr.trim().toLowerCase();
    setLoading(true);

    try {
      // 1. Try Firebase Auth
      const res = await fbSignIn(auth, cleanEmail, passStr);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('user_profile_name', res.user.displayName || cleanEmail.split('@')[0]);
        return;
      }
    } catch (fbErr) {
      console.warn('Firebase Auth error, attempting local storage authentication fallback:', fbErr);
    }

    // 2. Local Storage Authentication Fallback
    const accounts = getLocalAccounts();
    const match = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (match) {
      if (match.pass !== passStr) {
        setLoading(false);
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      const localUserObj: LocalUser = {
        uid: match.uid,
        email: match.email,
        displayName: match.displayName
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUserObj));
      localStorage.setItem('user_profile_name', match.displayName);
      setUser(localUserObj);
      setLoading(false);
      return;
    }

    // If no existing account in local storage, register automatically
    const newUid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const displayName = cleanEmail.split('@')[0];
    const newAccount = { email: cleanEmail, pass: passStr, uid: newUid, displayName };
    saveLocalAccount(newAccount);

    const localUserObj: LocalUser = { uid: newUid, email: cleanEmail, displayName };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUserObj));
    localStorage.setItem('user_profile_name', displayName);
    setUser(localUserObj);
    setLoading(false);
  };

  const signUpWithEmail = async (emailStr: string, passStr: string) => {
    const cleanEmail = emailStr.trim().toLowerCase();
    setLoading(true);

    try {
      // 1. Try Firebase Sign Up
      const res = await fbSignUp(auth, cleanEmail, passStr);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('user_profile_name', cleanEmail.split('@')[0]);
        return;
      }
    } catch (fbErr) {
      console.warn('Firebase SignUp warning, saving local account:', fbErr);
    }

    // 2. Local Storage Registration
    const newUid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const displayName = cleanEmail.split('@')[0];
    const newAccount = { email: cleanEmail, pass: passStr, uid: newUid, displayName };
    saveLocalAccount(newAccount);

    const localUserObj: LocalUser = { uid: newUid, email: cleanEmail, displayName };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUserObj));
    localStorage.setItem('user_profile_name', displayName);
    setUser(localUserObj);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
