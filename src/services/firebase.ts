import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use the databaseId provided in firebase-applet-config.json if specified, otherwise default to standard firestore
export const db = firebaseConfig.firestoreDatabaseId 
  ? initializeFirestore(app, { ignoreUndefinedProperties: true }, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth and sign in anonymously to satisfy any default Firebase Security Rules
export const auth = getAuth(app);
signInAnonymously(auth)
  .then((userCreds) => {
    console.log('Signed in anonymously to Firebase project:', userCreds.user.uid);
  })
  .catch((err) => {
    console.warn('Anonymous sign-in was skipped or not enabled in Firebase project:', err.message);
  });

export default app;

