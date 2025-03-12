'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUser } from '../lib/firestore';
import type { UserData } from '../lib/firestore';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, requestDetails?: {
    accommodationType: string;
    location: string;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          const token = await user.getIdToken();
          Cookies.set('token', token);
        } else {
          Cookies.remove('token');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    name: string,
    requestDetails?: {
      accommodationType: string;
      location: string;
    }
  ) => {
    if (!auth) throw new Error('Auth is not initialized');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      await createUser({
        id: user.uid,
        email: user.email!,
        name,
        role: 'user',
        requestDetails: requestDetails ? {
          ...requestDetails,
          dateSubmitted: new Date()
        } : undefined
      });
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth is not initialized');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Auth is not initialized');
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 