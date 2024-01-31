const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

exports.handleRequest = onRequest(async (req, res) => {
  console.log('[handleRequest] running inside the http method');

  console.log(req.query.text);
  
  res.json({ result: `OK` });
});

