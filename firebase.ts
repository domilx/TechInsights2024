import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, FirestoreSettings } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Firebase configuration
const firebaseConfig = {
  //CONFIG HERE
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the new local cache setting
const dbSettings = {
  localCache: {
    // Specify any custom settings for the local cache here
  }
} as FirestoreSettings;

const db = initializeFirestore(app, dbSettings);

const storage = getStorage(app);
const auth = firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { db, auth, storage };
