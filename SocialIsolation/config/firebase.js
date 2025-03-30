import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb9sCY1D3UUZOHDwkwhFBkjPN4T4wU8nA",
  authDomain: "social-isolation-data.firebaseapp.com",
  projectId: "social-isolation-data",
  storageBucket: "social-isolation-data.firebasestorage.app",
  messagingSenderId: "874956194019",
  appId: "1:874956194019:web:9f05ec2c5be861d60785d6",
  measurementId: "G-H32FDNX3TM"
};

export const app = initializeApp (firebaseConfig);
export const auth = getAuth (app);
export const googleProvider = new GoogleAuthProvider ();
export const db = getFirestore (app);