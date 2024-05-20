// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHoCaYZ8tWanoE0YMY1yWQy6zc5bxSDIg",
    authDomain: "ai-chatbot-42003.firebaseapp.com",
    projectId: "ai-chatbot-42003",
    storageBucket: "ai-chatbot-42003.appspot.com",
    messagingSenderId: "373487695386",
    appId: "1:373487695386:web:5439afc32af973944343a3",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
