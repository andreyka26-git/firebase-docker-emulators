import {
    collection,
    setDoc,
    doc,
    getDoc,
} from "firebase/firestore";
import { getFirestoreDb } from "./firestore-base";

const userCollection = "users";

const db = getFirestoreDb();

export async function getUserProfile(userId) {
    if (!userId) {
        console.log("[getUserProfile]: userId is empty");
        return;
    }

    const userProfileCollection = collection(db, userCollection);

    const documentDef = doc(userProfileCollection, userId);

    const document = await getDoc(documentDef);
    const obj = document.data();

    return obj;
}

export async function upsertUserProfile(userId, userProfile) {
    if (!userId) {
        console.log("[upsertUserProfile]: userId is empty");
        return;
    }

    const userProfileCollection = collection(db, userCollection);
    const document = doc(userProfileCollection, userId);

    await setDoc(document, userProfile);
}