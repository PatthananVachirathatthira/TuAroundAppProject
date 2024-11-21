import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, update } from "firebase/database"; // Firebase Database methods
import { getStorage } from "firebase/storage"; // Firebase Storage method

const firebaseConfig = {
  apiKey: "AIzaSyCZUrkuUG-ipwT4uRlwFizXFio5yOsH_JE",
  authDomain: "motorbiketaxi-92f3e.firebaseapp.com",
  databaseURL: "https://motorbiketaxi-92f3e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "motorbiketaxi-92f3e",
  storageBucket: "motorbiketaxi-92f3e.appspot.com",
  messagingSenderId: "469231599925",
  appId: "1:469231599925:web:09c8743b158e8ad3cf0c7c",
  measurementId: "G-9RS61V82TK"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const storage = getStorage(app);

export { database, ref, set, onValue, push, update, storage };
