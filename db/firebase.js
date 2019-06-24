var admin = require("firebase-admin");
var serviceAccount = require('../mobile-performance-seo-firebase-adminsdk-efn8z-07e14fbb5b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobile-performance-seo.firebaseio.com/"
});

// Get a firestore reference
var firestore = admin.firestore();

function handleSnapshot(snapshot) {
  var scores = []
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      scores.push(doc.data());
    })
  }
  return scores;
}

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

function writeDailyStatisticsByWebsiteId(websiteId, data) {
  return new Promise((resolve, reject) => {
    firestore.collection('sites').doc(websiteId).collection('dailyStatistics').add(data)
    .then((ref) => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    })
  });
}

function getPageSpeedPerformanceScoreForWebsite(startAt, endAt = null, websiteId, dataFields) {
  return new Promise((resolve, reject) => {
    if (endAt) {
      firestore.collection(websiteId)
        .orderBy("lighthouseResult.fetchTime")
        .startAt(startAt)
        .endAt(endAt)
        .select(...dataFields)
        .get()
        .then(snapshot => {
          resolve(handleSnapshot(snapshot));
        })
        .catch(err => {
          reject(err);
        })
    } else {
      firestore.collection(websiteId)
        .orderBy("lighthouseResult.fetchTime")
        .startAt(startAt)
        .select(...dataFields)
        .get()
        .then(snapshot => {
          resolve(handleSnapshot(snapshot));
        })
        .catch(err => {
          reject(err);
        })
    }
  });
}

module.exports = {
  writePageSpeedPerformanceByUrl,
  getPageSpeedPerformanceScoreForWebsite,
  writeDailyStatisticsByWebsiteId,
}

