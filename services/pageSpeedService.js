const debug = require('debug')('pageSpeedService');
const pageSpeedController = require('../controllers/pageSpeedController');
const config = require('../config');
const { isValidDateFormat } = require('../util/helpers');

const createPageSpeedPerformanceScoreForGccWebsites = (req, res) => {
  debug('createPageSpeedPerformanceScoreForGccWebsites');
  pageSpeedController.createPageSpeedPerformanceScoreForWebsites(config.gccWebsites)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
}

const createPageSpeedPerformanceScoreForCompetitorWebsites = (req, res) => {
  debug('createPageSpeedPerformanceScoreForCompetitorWebsites');
  pageSpeedController.createPageSpeedPerformanceScoreForWebsites(config.competitorWebsites)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
}

const getPageSpeedPerformanceScoreForWebsite = async function(req, res) {
  debug('getPageSpeedPerformanceScoreForWebsite');
  const { startAt, endAt, websiteId } = req.query
  if (!websiteId) {
    res.sendStatus(400);
  } else {
    try {
      const scores = await pageSpeedController.getPageSpeedPerformanceScoreForWebsite(startAt, endAt, websiteId);
      res.status(200).json(scores);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
}

const calculateDailyStatisticsForGccWebsites = async function(req, res) {
  debug('calculateDailyStatisticsForGccWebsites');
  const dateFormat = "MM/DD/YYYY";
  const { date } = req.query
  if (!date || !isValidDateFormat(date, dateFormat)) {
    res.sendStatus(400);
  } else {
    try {
      const dailyStatistics = await pageSpeedController.calculateDailyStatisticsForWebsites(date, config.gccWebsites);
      res.status(200).json(dailyStatistics);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
}


getPageSpeedPerformanceScoreForWebsite
module.exports = {
  createPageSpeedPerformanceScoreForGccWebsites,
  createPageSpeedPerformanceScoreForCompetitorWebsites,
  getPageSpeedPerformanceScoreForWebsite,
  calculateDailyStatisticsForGccWebsites
}