var admin = require("firebase-admin");
var serviceAccount = require('../mobile-performance-seo-firebase-adminsdk-efn8z-07e14fbb5b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobile-performance-seo.firebaseio.com/"
});

// Get a database reference to our blog
var db = admin.database();
var ref = db.ref('performance');
var scoresRef = ref.child('scores');

function writePageSpeedPerformance(data) {
  var newScoreRef = scoresRef.push();
  return new Promise((resolve, reject) => {
    newScoreRef.set(data)
    .then(() => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    })
  });
}

function writePageSpeedPerformanceByUrl(websiteId, data) {
  const urlRef = db.ref(`performance/${websiteId}/scores`);
  var newScoreRef = urlRef.push();
  return new Promise((resolve, reject) => {
    newScoreRef.set(data)
    .then(() => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    })
  });
}

module.exports = {
  writePageSpeedPerformance,
  writePageSpeedPerformanceByUrl,
}