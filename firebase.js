import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth"; // Updated import
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBHVuAf_REo1mnajrt3eb6P36e8JbUXlwM",
  authDomain: "techinsights-58aba.firebaseapp.com",
  projectId: "techinsights-58aba",
  storageBucket: "techinsights-58aba.appspot.com",
  messagingSenderId: "902770510588",
  appId: "1:902770510588:web:10c32f44846cdc42232579"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
if(!Platform.OS === 'web') {
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
const storage = getStorage(app);

// If you need to set any asynchronous settings or configurations,
// do it inside this function.
const initializeFirebase = async () => {
  // Here you can handle any async initialization
  // For now, we've removed setPersistence as it's not correctly configured for React Native.
};

initializeFirebase();

export { db, auth, storage };