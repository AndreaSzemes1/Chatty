// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa0GAciy-0zDWeGKBrprMFnA_GmFPJKWM",
  authDomain: "chatty-app-4a864.firebaseapp.com",
  projectId: "chatty-app-4a864",
  storageBucket: "chatty-app-4a864.firebasestorage.app",
  messagingSenderId: "421073280163",
  appId: "1:421073280163:web:446d2b2e2ce501db137316",
  measurementId: "G-DWYNV08CNQ"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);