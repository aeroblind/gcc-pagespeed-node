var admin = require("firebase-admin");
var serviceAccount = require('../mobile-performance-seo-firebase-adminsdk-efn8z-07e14fbb5b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobile-performance-seo.firebaseio.com/"
});

// Get a firestore reference
var firestore = admin.firestore();

function writePageSpeedPerformanceByUrl(websiteId, data) {
  return new Promise((resolve, reject) => {
    firestore.collection(websiteId).add(data)
    .then((ref) => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    })
  });
}

module.exports = {
  writePageSpeedPerformanceByUrl,
}