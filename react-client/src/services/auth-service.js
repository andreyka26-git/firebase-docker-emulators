import {
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { getFirebaseAuth } from "./firestore-base";

const auth = getFirebaseAuth();

let currentUser = null;

export async function getIdToken() {
    return await auth.currentUser.getIdToken();
}

export async function getCurrentUser() {
    return currentUser;
}

export async function signInWithEmailPassword() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, "someemail@gmail.com", "passP123*");
        const user = userCredential.user;

        return user;
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            const newUserCredential = await createUserWithEmailAndPassword(auth, "someemail@gmail.com", "passP123*");
            const newUser = newUserCredential.user;

            return newUser;
        }

        throw error;
    }
}

export async function logOut() {
    await signOut(auth);
}

export async function subscribeToUserUpdate(func) {
    return auth.onAuthStateChanged(async user => {
        await func(user);
    });
}