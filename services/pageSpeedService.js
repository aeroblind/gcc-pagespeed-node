const debug = require('debug')('pageSpeedService');
const pageSpeedController = require('../controllers/pageSpeedController');

const createPageSpeedPerformanceScoreForAllUrls = (req, res) => {
  debug('createPageSpeedPerformanceScoreForAllUrls');
  pageSpeedController.createPageSpeedPerformanceScoreForAllUrls()
  .then((data) => {
    res.status(200).json(data);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
}

const test = (req, res) => {
  debug('start');
  res.status(200).send('test...')
}

module.exports = {
  createPageSpeedPerformanceScoreForAllUrls,
  test,
}