import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB02OSM-4yA3WxMZVUX8NrHCPrelqXWNgo",
  authDomain: "mini-ecommerce-platform.firebaseapp.com",
  projectId: "mini-ecommerce-platform",
  storageBucket: "mini-ecommerce-platform.firebasestorage.app",
  messagingSenderId: "480691060940",
  appId: "1:480691060940:web:5f924e335d50b6004f0269"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);