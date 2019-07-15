const debug = require('debug')('pageSpeedController');
const axios = require('axios');
const moment = require('moment');
const db = require('../db/firebase');
const config = require('../config');
const { parseScoreFromLighthouseResults }  = require('../util/helpers');
const { getStatistics, calculateMedian } = require('../util/statistics');

const key = process.env.PAGESPEED_API_KEY;
const baseUrl = config.pageSpeedBaseUrl;

const createScoreByWebsiteIdObj = (websiteObjs, scores) => {
  const obj = {};
  websiteObjs.map( (websiteObj, index) => {     
    obj[websiteObj.websiteId] = scores[index];
  })
  return obj;
};

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

const getPageSpeedPerformanceScoreForWebsites = async function(websiteIdsWithTime, fields) {
  debug('getPageSpeedPerformanceScoreForWebsites');
  const promises = [];
  const parsedWebsiteObjs = [];
  websiteIdsWithTime.map( w => {
    const parsedObj = JSON.parse(w);
    parsedWebsiteObjs.push(parsedObj);
    const options = {
      startAt: parsedObj.startAt,
      endAt: parsedObj.endAt,
      websiteId: parsedObj.websiteId,
      fields
    }
    promises.push(db.getPageSpeedPerformanceScoreForWebsite(options));
  })
  const results = await Promise.all(promises);
  return createScoreByWebsiteIdObj(parsedWebsiteObjs, results);
}

const calculateDailyStatisticsForWebsites = async function(date, websites) {
  debug('calculateDailyStatisticsForGccWebsites');

  const fields = [
    'lighthouseResult.categories.performance.score',
  ]

  const getPromises = [];
  const writePromises = [];

  websites.map(website => {
    const options = {
      startAt: moment(date, "MM/DD/YYYY").utc().format(),
      endAt: moment(date, "MM/DD/YYYY").add(1, 'days').utc().format(),
      websiteId: website.id,
      fields,
    }
    getPromises.push(db.getPageSpeedPerformanceScoreForWebsite(options))
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
}

const getStatisticsForWebsites = async function(websiteData) {
  debug('getStatisticsForWebsites');
  const promises = [];
  const jsonParsedWebsiteData = [];
  websiteData.map( data => {
    const jsonData = JSON.parse(data);
    jsonParsedWebsiteData.push(jsonData);
    const options = {
      startAt: jsonData.startAt,
      endAt: jsonData.endAt,
      websiteId: jsonData.websiteId,
      fields: jsonData.fields,
    }
    promises.push(db.getPageSpeedPerformanceScoreForWebsite(options));
  })
  const results = await Promise.all(promises);
  const parsedScoreValues = parseScoreFromLighthouseResults(results);
  const medianScores = parsedScoreValues.map( values => {
    return calculateMedian(values) * 100;
  })
  return createScoreByWebsiteIdObj(jsonParsedWebsiteData, medianScores);
}



module.exports = {
  createPageSpeedPerformanceScoreForWebsites,
  getPageSpeedPerformanceScoreForWebsite,
  getPageSpeedPerformanceScoreForWebsites,
  calculateDailyStatisticsForWebsites,
  getStatisticsForWebsites,
}
