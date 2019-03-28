const debug = require('debug')('pageSpeedService');
const pageSpeedController = require('../controllers/pageSpeedController');

const createPageSpeedPerformanceScore = (req, res) => {
  debug('getPerformanceScore');
  pageSpeedController.createPageSpeedPerformanceScore()
  .then((data) => {
    res.status(200).json(data);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
}

const start = (req, res) => {
  debug('start');
  pageSpeedController.startCron()
  res.status(200).send('started...')
}

const stop = (req, res) => {
  debug('stop');
  pageSpeedController.stopCron()
  res.status(200).send('stopped.')
}

module.exports = {
  createPageSpeedPerformanceScore,
  start,
  stop,
}