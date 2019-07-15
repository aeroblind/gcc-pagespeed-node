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

async function createDocument(ref, data) {
  return new Promise((resolve, reject) => {
    try {
      ref.add(data)
      .then(_ => {
        resolve(data);
      })
    } catch (err) {
      reject(err);
    }
  })
}

function updateDocument(snapshot, ref, data) {
  return new Promise((resolve, reject) => {
    try {
      snapshot.forEach( doc => {
        ref.doc(doc.id).update(data);
      });
      resolve(data)
    } catch (err) {
      reject(err);
    }
  })
}

function handleDailyStatisticSnapshot(snapshot, ref, data) {
  if (snapshot.empty) {
    return createDocument(ref, data);
  } else {
    return updateDocument(snapshot, ref, data)
  }
}

async function writeDailyStatisticsByWebsiteId(websiteId, data) {
  return new Promise((resolve, reject) => {
    const ref = firestore.collection('sites').doc(websiteId).collection('dailyStatistics')
    ref
    .where("date", "==", data.date)
    .get()
    .then(snapshot => {
      return handleDailyStatisticSnapshot(snapshot, ref, data)
    })
    .then(results => {
      resolve(results);
    })
    .catch(err => {
      reject(err);
    })
  });
}

function getPageSpeedPerformanceScoreForWebsite(options) {
  const { startAt, endAt, websiteId, fields } = options;
  return new Promise((resolve, reject) => {
    if (endAt) {
      firestore.collection(websiteId)
        .orderBy("lighthouseResult.fetchTime")
        .startAt(startAt)
        .endAt(endAt)
        .select(...fields)
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
        .select(...fields)
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