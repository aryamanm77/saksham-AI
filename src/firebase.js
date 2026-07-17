// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo4FfFfgbvaAYwq6T6aGIAkhnwa74ou1Y",
  authDomain: "saksham-ai-50820.firebaseapp.com",
  projectId: "saksham-ai-50820",
  storageBucket: "saksham-ai-50820.firebasestorage.app",
  messagingSenderId: "724876360668",
  appId: "1:724876360668:web:75349a395594d0fdf1ed19",
  // Updated to Asia region based on your previous project
  databaseURL: "https://saksham-ai-50820-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
