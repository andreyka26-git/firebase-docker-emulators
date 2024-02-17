require('dotenv').config();
const express = require('express');
const { initializeApp } = require("firebase-admin/app");
const { firestore } = require("firebase-admin");

// this is necessary in case you are running locally against emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// here project id is also needed only for nodejs
initializeApp({projectId: process.env.PROJECT_ID});

const app = express();

app.use(express.json());

app.get('/test', async (req, res) => {
    console.log('[handleRequest] running inside the http method');

    if (!await isAuthenticated(req)) {
        res.status(403).send('Unauthorized');
        return;
      }

    const collectionName = 'your_collection_name';

    const documentData = {
        query: req.query?.text ?? "default data"
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

async function isAuthenticated(req) {
    let idToken;
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      idToken = req.headers.authorization.split('Bearer ')[1];
    }
    
    if (req.cookies) {
      console.log('Found "__session" cookie');
      idToken = req.cookies.__session;
    }
  
    if (!idToken) {
      console.log('Id token is not found');
      return false;
    }
  
    const auth = getAdminAuth();
    const decodedIdToken = await auth.verifyIdToken(idToken);
  
    console.log(decodedIdToken);
  
    req.user = decodedIdToken;
    return true;
  }