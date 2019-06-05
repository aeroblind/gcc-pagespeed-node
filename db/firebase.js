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

function getPageSpeedPerformanceScoreForWebsite(startAt, endAt, websiteId) {
  return new Promise((resolve, reject) => {
      firestore.collection(websiteId)
      .orderBy("lighthouseResult.fetchTime")
      .startAt(startAt)
      .endAt(endAt)
      .select(
        'lighthouseResult.fetchTime',
        'lighthouseResult.audits.interactive',
        'lighthouseResult.audits.speed-index',
        'lighthouseResult.audits.first-cpu-idle',
        'lighthouseResult.audits.first-contentful-paint',
        'lighthouseResult.audits.first-meaningful-paint',
        'lighthouseResult.categories.performance.score',
        'lighthouseResult.categories.performance.auditRefs',
      )
      .get()
      .then(snapshot => {
        resolve(handleSnapshot(snapshot));
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
    }
    
  });
}

module.exports = {
  writePageSpeedPerformanceByUrl,
  getPageSpeedPerformanceScoreForWebsite,
}