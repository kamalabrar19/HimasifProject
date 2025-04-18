// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase
// Ganti dengan konfigurasi Firebase Anda sendiri
const firebaseConfig = {
    apiKey: "AIzaSyCmm8zIgQoem1CjvSgc9Hx4PQBjCUm3Dhw",
    authDomain: "himasifproject.firebaseapp.com",
    projectId: "himasifproject",
    storageBucket: "himasifproject.firebasestorage.app",
    messagingSenderId: "826709494742",
    appId: "1:826709494742:web:b3495f97bb20caf19c7277",
    measurementId: "G-QWDC3093S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };