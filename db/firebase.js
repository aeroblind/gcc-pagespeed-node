var admin = require("firebase-admin");
var serviceAccount = require('../gcc-pagespeed-firebase-firebase-adminsdk-qovuf-ec8992d8e3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gcc-pagespeed-firebase.firebaseio.com"
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

module.exports = {
  writePageSpeedPerformance,
}