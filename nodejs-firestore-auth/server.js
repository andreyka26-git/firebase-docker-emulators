require('dotenv').config();
var serviceAccount = require('./serviceAccountKey.json');

const express = require('express');
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { firestore } = require("firebase-admin");
const { getAuth } = require('firebase-admin/auth');

const cors = require('cors');

console.log(process.env.ENVIRONMENT);

if (process.env.ENVIRONMENT === 'local') {
    console.log('using localhost:8080 as firestore emulator');
    console.log('using localhost:9099 as auth emulator');

    // this is necessary in case you are running locally against emulator
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

    // here project id is needed for nodejs
    initializeApp({ projectId: process.env.PROJECT_ID });
} else {
    initializeApp({
        credential: admin.credential.cert(serviceAccount),
        //databaseURL: 'https://my-project.firebaseio.com'
    });
}


const authMiddleware = async (req, res, next) => {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        idToken = req.headers.authorization.split('Bearer ')[1];
    }

    if (req.cookies) {
        console.log('Found "__session" cookie');
        idToken = req.cookies.__session;
    }

    if (idToken) {
        const auth = getAuth();
        const decodedIdToken = await auth.verifyIdToken(idToken);
        req.user = decodedIdToken;
    }

    next();
};

const app = express();

app.use(authMiddleware)
app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
    console.log('[handleRequest] running inside the http method');

    if (!req.user) {
        res.status(403).send('Unauthorized');
        return;
    }

    const collectionName = 'your_collection_name';

    const documentData = {
        query: req.query?.text ?? "default data",
        user: req.user?.email
    };

    try {
        const collectionRef = firestore().collection(collectionName);
        await collectionRef.add(documentData);

        res.json({ result: `Document added to Firestore` });
    } catch (error) {
        console.error('Error adding document: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
