// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxk_5ZFNBlSHPjH16ycdHjqkPpVx2RCMg",
    authDomain: "deep-ocean-7715b.firebaseapp.com",
    projectId: "deep-ocean-7715b",
    storageBucket: "deep-ocean-7715b.firebasestorage.app",
    messagingSenderId: "900073727472",
    appId: "1:900073727472:web:70bc936c4bcadd4ba7e935",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);