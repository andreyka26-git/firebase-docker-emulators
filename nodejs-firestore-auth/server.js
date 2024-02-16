const express = require('express');
const { initializeApp } = require("firebase-admin/app");
const { firestore } = require("firebase-admin");

// here project id is also needed only for nodejs
initializeApp({projectId: process.env.PROJECT_ID});

const app = express();

app.use(express.json());

app.get('/test', async (req, res) => {
    console.log('[handleRequest] running inside the http method');

    const collectionName = 'your_collection_name';

    const documentData = {
        query: req.query.text
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

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});