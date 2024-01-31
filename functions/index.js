const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { firestore } = require("firebase-admin");

initializeApp();

exports.handleRequest = onRequest(async (req, res) => {
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