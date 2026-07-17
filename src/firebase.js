// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_Z28HSXiC7Jx_gfvNG-QnqojZ0wSYop8",
  authDomain: "saksham-e0903.firebaseapp.com",
  databaseURL: "https://saksham-e0903-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "saksham-e0903",
  storageBucket: "saksham-e0903.firebasestorage.app",
  messagingSenderId: "457283816573",
  appId: "1:457283816573:web:8358b6328cda7136ebf514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
