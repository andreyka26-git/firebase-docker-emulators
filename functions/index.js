const functions = require("firebase-functions");
const { PubSub } = require("@google-cloud/pubsub");

// Instantiates a client
const pubsub = new PubSub();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// http://localhost:5001/dummy-project/us-central1/helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/**
 * Publishes a message to a Cloud Pub/Sub Topic.
 *
 * @example
 * gcloud functions call publish --data '{"topic":"[YOUR_TOPIC_NAME]","message":"Hello, world!"}'
 *
 *   - Replace `[YOUR_TOPIC_NAME]` with your Cloud Pub/Sub topic name.
 * 
 * http://localhost:5001/dummy-project/us-central1/publish
 * 
 * {
	  "topic": "testTopic",
	  "message": "hello world"
   }
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.topic Topic name on which to publish.
 * @param {string} req.body.message Message to publish.
 * @param {object} res Cloud Function response context.
 */
exports.publish = functions.https.onRequest(async (req, res) => {
  if (!req.body.topic || !req.body.message) {
    res
      .status(500)
      .send(
        'Missing parameter(s); include "topic" and "subscription" properties in your request.'
      );
    return;
  }

  console.log(`Publishing message to topic ${req.body.topic}`);

  // References an existing topic
  const topic = pubsub.topic(req.body.topic);

  const messageObject = {
    data: {
      message: req.body.message,
    },
  };
  const messageBuffer = Buffer.from(JSON.stringify(messageObject), "utf8");

  // Publishes a message
  try {
    await topic.publish(messageBuffer);
    res.status(200).send("Message published.");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
    return Promise.reject(err);
  }
});

/**
 * This can be called by publishing a message to the "testTopic"
 * curl -H 'content-type: application/json'-X POST --data $'{  "messages": [{"data": "abcd"}]}'  http://localhost:8085/v1/projects/dummy-project/topics/testTopic:publish
 */
exports.testTopic = functions.pubsub.topic("testTopic").onPublish((message) => {
  functions.logger.info(message.data);
  functions.logger.info(message, { structuredData: true });
  return;
});

// Listen for updates to any `user` document.
exports.countNameChanges = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    // We'll only update if the name has changed.
    // This is crucial to prevent infinite loops.
    if (data.name == previousData.name) {
      return null;
    }

    // Retrieve the current count of name changes
    let count = data.name_change_count;
    if (!count) {
      count = 0;
    }

    // Then return a promise of a set operation to update the count
    return change.after.ref.set(
      {
        name_change_count: count + 1,
      },
      { merge: true }
    );
  });
