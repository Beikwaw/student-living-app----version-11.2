'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  getAuth
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUser } from '../lib/firestore';
import type { UserData } from '../lib/firestore';
import Cookies from 'js-cookie';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: 'student' | 'admin', requestDetails?: {
    accommodationType: string;
    location: string;
  }) => Promise<void>;
  login: (email: string, password: string, userType: 'student' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db]);

  const signUp = async (
    email: string, 
    password: string, 
    name: string,
    role: 'student' | 'admin',
    requestDetails?: {
      accommodationType: string;
      location: string;
    }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      await createUser({
        id: user.uid,
        email: user.email!,
        name,
        role,
        requestDetails: requestDetails ? {
          ...requestDetails,
          dateSubmitted: new Date()
        } : undefined
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, userType: 'student' | 'admin') => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as UserData;

      // Check if user type matches
      if (userData.role !== userType) {
        throw new Error(`Access denied. This account is not authorized as ${userType}.`);
      }

      setUser(user);
      setUserData(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 