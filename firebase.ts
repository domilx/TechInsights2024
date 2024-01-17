import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHVuAf_REo1mnajrt3eb6P36e8JbUXlwM",
  authDomain: "techinsights-58aba.firebaseapp.com",
  projectId: "techinsights-58aba",
  storageBucket: "techinsights-58aba.appspot.com",
  messagingSenderId: "902770510588",
  appId: "1:902770510588:web:10c32f44846cdc42232579",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const auth: Auth = getAuth(app);

export { db, auth, storage };
