// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-chat-assistant-ac0b4.firebaseapp.com",
  projectId: "ai-chat-assistant-ac0b4",
  storageBucket: "ai-chat-assistant-ac0b4.appspot.com",
  messagingSenderId: "72068664025",
  appId: "1:72068664025:web:f62df54bb160a2aaa18cc8"
};

let app;
let db;

if (typeof window !== "undefined") {
  // Client-side initialization
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} else {
  // Server-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    app = getApp();
    db = getFirestore(app);
  }
}

export { db };