const express = require('express');
const router = express.Router();
const pageSpeedService = require('../services/pageSpeedService'); 

router.get('/getPageSpeedPerformanceScoreForWebsites', pageSpeedService.getPageSpeedPerformanceScoreForWebsites);
router.get('/getStatisticsForWebsites', pageSpeedService.getStatisticsForWebsites);
router.get('/getPageSpeedPerformanceScoreForWebsite', pageSpeedService.getPageSpeedPerformanceScoreForWebsite);
router.get('/createPageSpeedPerformanceScoreForGccWebsites', pageSpeedService.createPageSpeedPerformanceScoreForGccWebsites);
router.get('/createPageSpeedPerformanceScoreForCompetitorWebsites', pageSpeedService.createPageSpeedPerformanceScoreForCompetitorWebsites);

router.post('/calculateDailyStatisticsForGccWebsites', pageSpeedService.calculateDailyStatisticsForGccWebsites);


module.exports = router;
