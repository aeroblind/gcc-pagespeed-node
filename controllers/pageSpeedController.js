require('dotenv').config();
const axios = require('axios');
const CronJob = require('cron').CronJob;
const db = require('../db/firebase');
const parsePageSpeedResults = require('../util/helpers').parsePageSpeedResults;

const key = process.env.PAGESPEED_API_KEY;
const targetUrl = 'https://www.blinds.com';
const baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const url = `${baseUrl}?strategy=mobile&url=${targetUrl}&key=${key}`;

const cronTime = '*/30 * * * * *';
const start = false;

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
  return axios.get(url)
    .then(res => {
      const data = parsePageSpeedResults(res);
      return db.writePageSpeedPerformance(data);
    })
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
}