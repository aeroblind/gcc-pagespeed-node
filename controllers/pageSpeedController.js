const debug = require('debug')('pageSpeedController');
const axios = require('axios');
const moment = require('moment');
const db = require('../db/firebase');
const config = require('../config');
const parsePageSpeedResults = require('../util/helpers').parsePageSpeedResults;
const { getStatistics } = require('../util/statistics');

const key = process.env.PAGESPEED_API_KEY;
const baseUrl = config.pageSpeedBaseUrl;

const createPageSpeedUrl = (targetUrl) => {
  return `${baseUrl}?strategy=mobile&url=${targetUrl}&key=${key}`;
}

const filterOutAxiosErrors = function (url) {
  return axios.get(url)
  .catch(err => {
    //  Do Nothing
    console.error(err.response.data.error);
  });
}

const createPageSpeedPerformanceScoreForWebsites = async function(websites) {
  debug('createPageSpeedPerformanceScoreForWebsites');
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
        if (!result.data) {
          return;
        }
        dbPromises.push(db.writePageSpeedPerformanceByUrl(websites[index].id, result.data))
      }
    })
    return Promise.all(dbPromises);
  })
  .catch(err => console.log(`Error - createPageSpeedPerformanceScoreForWebsites: ${err}`));
}

const getPageSpeedPerformanceScoreForWebsite = function(startAt, endAt, websiteId) {
  debug('getPageSpeedPerformanceScoreForWebsite');
  const dataFields = [
    'lighthouseResult.fetchTime',
    'lighthouseResult.audits.interactive',
    'lighthouseResult.audits.speed-index',
    'lighthouseResult.audits.first-cpu-idle',
    'lighthouseResult.audits.first-contentful-paint',
    'lighthouseResult.audits.first-meaningful-paint',
    'lighthouseResult.categories.performance.score',
    'lighthouseResult.categories.performance.auditRefs',
  ]
  return db.getPageSpeedPerformanceScoreForWebsite(startAt, endAt, websiteId, dataFields);
}

const calculateDailyStatisticsForWebsites = async function(date, websites) {
  debug('calculateDailyStatisticsForGccWebsites');

  const dailyStatistics = [];

  const startAt = moment(date, "MM/DD/YYYY").utc().format();
  const endAt= moment(date, "MM/DD/YYYY").add(1, 'days').utc().format();
  const dataFields = [
    'lighthouseResult.categories.performance.score',
  ]

  const getPromises = [];
  const writePromises = [];

  websites.map(website => {
    getPromises.push(db.getPageSpeedPerformanceScoreForWebsite(startAt, endAt, website.id, dataFields))
    // .then(rawScores => {
    //   const scores = rawScores.map(score => score.lighthouseResult.categories.performance.score);
      // const data = {
      //   date,
      //   statistics: getStatistics(scores)
      // };
    //   return db.writeDailyStatisticsByWebsiteId(website, data);
    // })
    // .then(results => {
    //   dailyStatistics.push(results);
    // })
  });


  return Promise.all(getPromises)
  .then(results => {
    results.map( (result, index) => {
      if (result) {
        if (!result) {
          return;
        }
        const scores = result.map(score => score.lighthouseResult.categories.performance.score);
        const data = {
          date,
          statistics: getStatistics(scores)
        };
        writePromises.push(db.writeDailyStatisticsByWebsiteId(websites[index].id, data));
      }
    })
    return Promise.all(writePromises);
  })
  .catch(err => console.log(`Error - calculateDailyStatisticsForWebsites: ${err}`));
}



module.exports = {
  createPageSpeedPerformanceScoreForWebsites,
  getPageSpeedPerformanceScoreForWebsite,
  calculateDailyStatisticsForWebsites
}