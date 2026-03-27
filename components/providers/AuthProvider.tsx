'use client';

import {
  User,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '@/lib/firebase';
import { syncAuthenticatedUser } from '@/lib/client-api';

interface AuthContextValue {
  loading: boolean;
  user: User | null;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        syncAuthenticatedUser(nextUser).catch((error) => {
          console.error('Failed to sync signed-in user', error);
        });
      }
    });

    return unsubscribe;
  }, []);

  async function signOutUser() {
    if (!auth) {
      return;
    }

    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ loading, user, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
