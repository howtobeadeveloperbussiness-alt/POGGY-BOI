import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore with specific database ID if configured
export const db: Firestore = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId)
  : getFirestore(app);

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'API_KEY'
);
