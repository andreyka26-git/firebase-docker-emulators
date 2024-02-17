import {
    GoogleAuthProvider,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { getUserProfile, upsertUserProfile } from "./firestore-storage";
import { getFirebaseAuth } from "./firestore-base";

const auth = getFirebaseAuth();

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
});

let currentUser = null;
let userChangedFunc = null;


export async function getIdToken() {
    return await auth.currentUser.getIdToken();
}

export async function getCurrentUser() {
    return currentUser;
}

export async function signInWithEmailPassword() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, "b.andriy.b2000@gmail.com", "pass123*");
        const user = userCredential.user;

        return user;
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            const newUserCredential = await createUserWithEmailAndPassword(auth, "b.andriy.b2000@gmail.com", "pass123*");
            const newUser = newUserCredential.user;

            return newUser;
        }

        throw error;
    }
}

export async function logOut() {
    await signOut(auth);
}

// seems like token lives 1 hour
export async function subscribeToUserUpdate(func) {
    userChangedFunc = func;

    return auth.onAuthStateChanged(async user => {
        await func(user);
    });
}