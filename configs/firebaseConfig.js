
import * as firebase from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBLC9fhnadHS8oGKrbvwQuCJ-c1RHNtbE",
    authDomain: "autospotter-290bc.firebaseapp.com",
    projectId: "autospotter-290bc",
    storageBucket: "autospotter-290bc.appspot.com",
    messagingSenderId: "805115554900",
    appId: "1:805115554900:web:395a5c263436afc4e991c1"
  };
  


const app = firebase.initializeApp(firebaseConfig);
initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });

const db = getFirestore();

export { app, db };