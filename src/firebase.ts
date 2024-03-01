// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF4N-iZ9sCxaVC2NXWU70aBB3de_ceM1c",
  authDomain: "scouting-app-prototype-9bf1f.firebaseapp.com",
  projectId: "scouting-app-prototype-9bf1f",
  storageBucket: "scouting-app-prototype-9bf1f.appspot.com",
  messagingSenderId: "827328514779",
  appId: "1:827328514779:web:33d594763a9e108d791afe"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);