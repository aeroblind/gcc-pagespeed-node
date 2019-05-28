const debug = require('debug')('pageSpeedController');
const axios = require('axios');
const db = require('../db/firebase');
const config = require('../config');
const parsePageSpeedResults = require('../util/helpers').parsePageSpeedResults;

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
        const data = parsePageSpeedResults(result.data);
        if (!data) {
          return;
        }
        dbPromises.push(db.writePageSpeedPerformanceByUrl(websites[index].id, data))
      }
    })
    return Promise.all(dbPromises);
  })
  .catch(err => console.log(`Error - createPageSpeedPerformanceScoreForWebsites: ${err}`));
}

module.exports = {
  createPageSpeedPerformanceScoreForWebsites
}