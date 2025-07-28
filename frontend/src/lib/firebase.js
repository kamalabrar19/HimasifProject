import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBQ2HzwRWKX0nX8Ixb-C0s7aFbGTn2nu50",
    authDomain: "chatbot-360-ai.firebaseapp.com",
    projectId: "chatbot-360-ai",
    storageBucket: "chatbot-360-ai.firebasestorage.app",
    messagingSenderId: "1002860666804",
    appId: "1:1002860666804:web:a1f30e40f6a1da9fe8dce1",
    measurementId: "G-883ZCLLBE4"
  };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
