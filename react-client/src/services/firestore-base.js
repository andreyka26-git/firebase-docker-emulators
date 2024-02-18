import { connectAuthEmulator, getAuth } from "@firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    projectId: process.env.REACT_APP_PROJECT_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (process.env.ENV === 'development') {
    console.log('using dev env for storage')

    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, 'http://localhost:9099/');
}

export function getFirestoreApp() {
    return app;
}

export function getFirebaseAuth() {
    return auth;
}

export function getFirestoreDb() {
    return db;
}