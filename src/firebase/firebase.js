import { initializeApp } from "firebase/app";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAdHyQ_QYt8FUDpcxDBYEkPkj3BtzSeqm4",
  authDomain: "inventario-da029.firebaseapp.com",
  projectId: "inventario-da029",
  storageBucket: "inventario-da029.appspot.com",
  messagingSenderId: "890120843827",
  appId: "1:890120843827:web:b26697498a89c7c6cde946",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
