import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBzZa8wykUIIIwJoB17jAMgGcI0QCH_S0k",
  authDomain: "ai-8e5dc.firebaseapp.com",
  projectId: "ai-8e5dc",
  storageBucket: "ai-8e5dc.firebasestorage.app",
  messagingSenderId: "651412701959",
  appId: "1:651412701959:web:3c96c1a2f8b77143243ba2",
  measurementId: "G-XX8BPV3J8Y"
  };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
