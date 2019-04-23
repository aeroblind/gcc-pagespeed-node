const debug = require('debug')('pageSpeedController');
const axios = require('axios');
const CronJob = require('cron').CronJob;
const db = require('../db/firebase');
const config = require('../config');
const parsePageSpeedResults = require('../util/helpers').parsePageSpeedResults;

const key = process.env.PAGESPEED_API_KEY;
const baseUrl = config.pageSpeedBaseUrl;
const websites = config.websites;

const cronTime = '*/30 * * * * *';
const start = false;

const createPageSpeedUrl = (targetUrl) => {
  return `${baseUrl}?strategy=mobile&url=${targetUrl}&key=${key}`;
}

const startCron = () => {
  if (!isActive) {
    cronJob.start();
    isActive = true;
  }
}

const stopCron = () => {
  if (isActive) {
    cronJob.stop();
    isActive = false;
  }
}

const createPageSpeedPerformanceScore = async function() {
  const targetUrl = config.websites[0].url;
  return axios.get(createPageSpeedUrl(targetUrl))
    .then(res => {
      const data = parsePageSpeedResults(res);
      return db.writePageSpeedPerformance(data);
    })
}

const filterOutAxiosErrors = function (url) {
  return axios.get(url)
  .catch(_ => {
    //  Do Nothing
  });
}


const createPageSpeedPerformanceScoreForAllUrls = async function() {
  debug('createPageSpeedPerformanceScoreForAllUrls');
  const promises = [];
  const dbPromises = []
  websites.map(website => {
    const url = createPageSpeedUrl(website.url);
    const promise = filterOutAxiosErrors(url);
    promises.push(promise);
  });

  return Promise.all(promises)
  .then(results => {
    results.map( (result, index) => {
      if (result) {
        const data = parsePageSpeedResults(result);
        dbPromises.push(db.writePageSpeedPerformanceByUrl(websites[index].id, data))
      }
    })
    return Promise.all(dbPromises);
  })
  .catch(err => console.log(`Error - createPageSpeedPerformanceScoreForAllUrls: ${err}`));
}

const onTick = () => {
  axios.get(url)
  .then(res => {
    const data = parsePageSpeedResults(res);
    db.writePageSpeedPerformance(data);
  })
  .catch(err => {
    console.log(err);
  })
}

const onComplete = function(){
  console.log('cron stopped.')
}

const cronJob = new CronJob(cronTime, onTick, onComplete, start);
var isActive = false;

module.exports = {
  startCron,
  stopCron,
  createPageSpeedPerformanceScore,
  createPageSpeedPerformanceScoreForAllUrls
}