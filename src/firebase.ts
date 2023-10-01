import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6ar2WOAvcBHmtFKoJzTm14bW_xhiWVss",
  authDomain: "advanced-micro-blog.firebaseapp.com",
  projectId: "advanced-micro-blog",
  storageBucket: "advanced-micro-blog.appspot.com",
  messagingSenderId: "315330580178",
  appId: "1:315330580178:web:ad22a8d8d719ddb88a270b",
  measurementId: "G-MG0FWE7RMN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
