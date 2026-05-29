// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1uuoQSBz50Y7zvOtdSjXk2Aq71LJE35o",
  authDomain: "cs-hoopers.firebaseapp.com",
  projectId: "cs-hoopers",
  storageBucket: "cs-hoopers.firebasestorage.app",
  messagingSenderId: "91705532975",
  appId: "1:91705532975:web:85fb4b1121a4c6949f5cda",
  measurementId: "G-ZJBXB5QNFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and export it for App.tsx to use
export const db = getFirestore(app); // <-- ADDED THIS