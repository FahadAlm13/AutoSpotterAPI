
import * as firebase from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDo6fgi3GLw1I3XBDwu3ZU1mbWmS2DFhZM",
    authDomain: "autospotter-ad598.firebaseapp.com",
    databaseURL: "https://autospotter-ad598-default-rtdb.firebaseio.com",
    projectId: "autospotter-ad598",
    storageBucket: "autospotter-ad598.appspot.com",
    messagingSenderId: "928109315099",
    appId: "1:928109315099:web:0d80307892b662362c24be"
};


const app = firebase.initializeApp(firebaseConfig);
initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });

const db = getFirestore();

export { app, db };