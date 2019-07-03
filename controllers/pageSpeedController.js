const debug = require('debug')('pageSpeedController');
const axios = require('axios');
const db = require('../db/firebase');
const config = require('../config');
const parsePageSpeedResults = require('../util/helpers').parsePageSpeedResults;

const key = process.env.PAGESPEED_API_KEY;
const baseUrl = config.pageSpeedBaseUrl;


const createScoreByWebsiteIdObj = (websiteIds, scores) => {
  const obj = {};
  websiteIds.map( (id, index) => {
    obj[id] = scores[index];
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

const getPageSpeedPerformanceScoreForWebsite = function(startAt, endAt = null, websiteId) {
  debug('getPageSpeedPerformanceScoreForWebsite');
  const options = {
    startAt,
    endAt,
    websiteId,
    fields: [
      'lighthouseResult.fetchTime',
      'lighthouseResult.audits.interactive',
      'lighthouseResult.audits.speed-index',
      'lighthouseResult.audits.first-cpu-idle',
      'lighthouseResult.audits.first-contentful-paint',
      'lighthouseResult.audits.first-meaningful-paint',
      'lighthouseResult.categories.performance.score',
      'lighthouseResult.categories.performance.auditRefs',
    ],
  }
  return db.getPageSpeedPerformanceScoreForWebsite(options);
}

const getPageSpeedPerformanceScoreForWebsites = async function(startAt, endAt, websiteIds, fields) {
  debug('getPageSpeedPerformanceScoreForWebsites');
  const promises = [];
  websiteIds.map( websiteId => {
    const options = {
      startAt,
      endAt,
      websiteId,
      fields
    }
    promises.push(db.getPageSpeedPerformanceScoreForWebsite(options));
  })
  const results = await Promise.all(promises);
  return createScoreByWebsiteIdObj(websiteIds, results);
}

module.exports = {
  createPageSpeedPerformanceScoreForWebsites,
  getPageSpeedPerformanceScoreForWebsite,
  getPageSpeedPerformanceScoreForWebsites
}