import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_AUTH_DOMAIN,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "others-6b77a",
  storageBucket: "others-6b77a.appspot.com",
  messagingSenderId: "75597416829",
  appId: "1:75597416829:web:e3c3131b84b3832b17e414",
  measurementId: "G-MV7Z55XWEG"
};

const app = initializeApp(firebaseConfig);
export const analytics = getStorage(app);
