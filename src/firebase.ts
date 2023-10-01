// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6ar2WOAvcBHmtFKoJzTm14bW_xhiWVss",
  authDomain: "advanced-micro-blog.firebaseapp.com",
  projectId: "advanced-micro-blog",
  storageBucket: "advanced-micro-blog.appspot.com",
  messagingSenderId: "315330580178",
  appId: "1:315330580178:web:ad22a8d8d719ddb88a270b",
  measurementId: "G-MG0FWE7RMN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
