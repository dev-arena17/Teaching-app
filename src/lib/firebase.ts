
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth"; // Import getAuth
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// --- DIAGNOSTIC LOG ---
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
console.log("Attempting to read Firebase API Key (from src/lib/firebase.ts):", apiKey);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey, // Use the apiKey variable read from process.env
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty in your environment variables (.env.local). Firebase will not be initialized. Please check your .env.local file and ensure it's loaded correctly by restarting your development server."
  );
} else {
  // Initialize Firebase
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Firebase initialization error (initializeApp):", error);
      // If initializeApp itself fails, app will remain undefined.
    }
  } else {
    app = getApp();
  }

  if (app) {
    try {
      auth = getAuth(app); // Initialize Auth
    } catch (error) {
      console.error("Firebase getAuth error:", error);
      // This is where the 'auth/invalid-api-key' error would likely manifest if 'app' initialized but the key is bad.
    }

    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) { // Double check app is defined
          try {
            analytics = getAnalytics(app);
          } catch (error) {
            console.error("Firebase getAnalytics error:", error)
          }
        }
      }).catch(error => {
        console.error("Error checking Firebase Analytics support:", error);
      });
    }
  } else if (firebaseConfig.apiKey) { // Only log this if an API key was provided but 'app' is still undefined
    console.error("Firebase app could not be initialized, even though an API key was provided. Auth and Analytics will not be available. Check previous errors from initializeApp.");
  }
}

export { app, auth, analytics, firebaseConfig }; // Export auth
