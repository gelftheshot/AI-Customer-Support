// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ai-chat-assistant-ac0b4.firebaseapp.com",
  projectId: "ai-chat-assistant-ac0b4",
  storageBucket: "ai-chat-assistant-ac0b4.appspot.com",
  messagingSenderId: "72068664025",
  appId: "1:72068664025:web:f62df54bb160a2aaa18cc8"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);