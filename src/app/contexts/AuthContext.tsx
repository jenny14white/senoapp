import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUser = async (firebaseUser: User): Promise<AuthUser> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  const name = userSnap.exists() ? userSnap.data().name : firebaseUser.displayName;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name,
    emailVerified: firebaseUser.emailVerified,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setIsOnboarded(false);
        setIsLoading(false);
        return;
      }

      const mappedUser = await mapFirebaseUser(firebaseUser);
      setUser(mappedUser);

      const onboardingRef = doc(db, 'userSettings', firebaseUser.uid);
      const onboardingSnap = await getDoc(onboardingRef);
      setIsOnboarded(onboardingSnap.exists() && onboardingSnap.data().onboarded === true);

      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      if (!credential.user.emailVerified) {
        await signOut(auth);
        throw new Error('Potwierdź email przed logowaniem. Sprawdź skrzynkę pocztową.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(
        doc(db, 'users', credential.user.uid),
        {
          email,
          name: email.split('@')[0],
          emailVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await firebaseSendEmailVerification(credential.user);
      await signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      throw new Error('Brak zalogowanego użytkownika');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  };

  const completeOnboarding = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    await setDoc(
      doc(db, 'userSettings', currentUser.uid),
      { onboarded: true, updatedAt: serverTimestamp() },
      { merge: true },
    );
    setIsOnboarded(true);
  };

  const sendEmailVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Brak zalogowanego użytkownika');
    }
    await firebaseSendEmailVerification(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        login,
        register,
        logout,
        resetPassword,
        changePassword,
        completeOnboarding,
        sendEmailVerification,
      }}
    >
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
