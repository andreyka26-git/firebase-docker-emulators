import {
    collection,
    setDoc,
    doc,
    getDocs,
    getDoc,
    deleteDoc,
    query,
    where,
    limit,
    orderBy,
    startAfter
} from "firebase/firestore";
import { getFirestoreDb } from "./firestore-base";

const userCollection = "users";
const dairySubCollection = "diary";
const tagsSubCollection = "tags";
const allTagsDoc = "all";

const favouritesSubCollection = "favourites";
const allFavouritesDoc = "all";

const db = getFirestoreDb();

export async function getUserProfile(userId) {
    if (!userId) {
        console.log("[getUserProfile]: userId is empty");
        return;
    }

    const userProfileCollection = collection(db, userCollection);

    const document = await getDocument(userProfileCollection, userId);

    logFirestoreRead('getUserProfile', 1);

    return document;
}

export async function upsertUserProfile(userId, userProfile) {
    if (!userId) {
        console.log("[upsertUserProfile]: userId is empty");
        return;
    }
    const userProfileCollection = collection(db, userCollection);
    const document = doc(userProfileCollection, userId);

    logFirestoreWrite('upsertUserProfile', 1);

    await setDoc(document, userProfile);
}

async function getDocument(collection, docId) {
    const documentDef = doc(collection, docId);

    const document = await getDoc(documentDef);
    const obj = document.data();

    return obj;
}

function logFirestoreWrite(methodName, numberOfWrites) {
    numberOfWrites = numberOfWrites > 0 ? numberOfWrites : 1;
    console.log(`WRITE [${methodName}] made {${numberOfWrites}} writes`);
}

function logFirestoreRead(methodName, numberOfReads) {
    numberOfReads = numberOfReads > 0 ? numberOfReads : 1;
    console.log(`READ [${methodName}] made {${numberOfReads}} reads`);
}

function logFirestoreDelete(methodName, numberOfDeletes) {
    numberOfDeletes = numberOfDeletes > 0 ? numberOfDeletes : 1;
    console.log(`Delete [${methodName}] made {${numberOfDeletes}} deletes`);
}