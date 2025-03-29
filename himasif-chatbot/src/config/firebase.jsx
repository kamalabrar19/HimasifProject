import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;