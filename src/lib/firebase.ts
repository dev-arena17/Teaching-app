
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

// Initialize Firebase
if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase Error: The hardcoded apiKey in firebaseConfig (src/lib/firebase.ts) is missing or empty. Firebase cannot be initialized."
  );
  // Prevent further initialization if critical config is missing
  // You might want to throw an error or handle this more gracefully depending on your app's needs
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Firebase initialization error:", error);
      // Handle initialization error, e.g., by not setting auth or analytics
    }
  } else {
    app = getApp();
  }

  // Ensure app is initialized before trying to get Auth or Analytics
  // @ts-ignore
  if (app) {
    try {
      auth = getAuth(app);
    } catch (error) {
      console.error("Firebase getAuth error:", error);
      // Handle Auth initialization error
    }

    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          try {
            // @ts-ignore
            analytics = getAnalytics(app);
          } catch (error) {
            console.error("Firebase getAnalytics error:", error);
          }
        }
      }).catch(error => {
        console.error("Error checking Firebase Analytics support:", error);
      });
    }
  } else {
    console.error("Firebase app was not initialized successfully. Auth and Analytics will not be available.");
  }
}

export { app, auth, analytics, firebaseConfig };
