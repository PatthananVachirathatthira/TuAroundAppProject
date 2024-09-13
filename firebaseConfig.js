//firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZUrkuUG-ipwT4uRlwFizXFio5yOsH_JE",
  authDomain: "motorbiketaxi-92f3e.firebaseapp.com",
  databaseURL: "https://motorbiketaxi-92f3e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "motorbiketaxi-92f3e",
  storageBucket: "motorbiketaxi-92f3e.appspot.caom",
  messagingSenderId: "469231599925",
  appId: "1:469231599925:web:09c8743b158e8ad3cf0c7c",
  measurementId: "G-9RS61V82TK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };
