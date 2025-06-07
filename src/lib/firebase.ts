// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_K8tIu4pgvDSZQe05w-3hZg7gNC_Tf88",
  authDomain: "teaching-app-9b513.firebaseapp.com",
  projectId: "teaching-app-9b513",
  storageBucket: "teaching-app-9b513.firebasestorage.app",
  messagingSenderId: "931821152876",
  appId: "1:931821152876:web:33a3bf322ff4cdc7d50649",
  measurementId: "G-4KE1E71653"
};

let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | undefined;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(error => {
    console.error("Error checking Firebase Analytics support:", error);
  });
}

export { app, auth, analytics, firebaseConfig };
