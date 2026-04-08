import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Fallback values allow quick start in development.
// For production, prefer setting VITE_FIREBASE_* variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCbSfIZ_LJ2HrLJvz-35lBSJO_uYcMKS8w',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lmbudgetproject.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lmbudgetproject',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lmbudgetproject.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '220517945531',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:220517945531:web:9b887ca960b3685da3599e',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
