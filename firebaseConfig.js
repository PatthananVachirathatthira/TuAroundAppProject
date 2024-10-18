//firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database"; // add push for adding new data
import { getStorage } from "firebase/storage"; // Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZUrkuUG-ipwT4uRlwFizXFio5yOsH_JE",
  authDomain: "motorbiketaxi-92f3e.firebaseapp.com",
  databaseURL: "https://motorbiketaxi-92f3e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "motorbiketaxi-92f3e",
  storageBucket: "motorbiketaxi-92f3e.appspot.com", //แก้ไขตรงนี้เป็น .com
  messagingSenderId: "469231599925",
  appId: "1:469231599925:web:09c8743b158e8ad3cf0c7c",
  measurementId: "G-9RS61V82TK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { database, ref, set, onValue, push, storage }; // Export storage
