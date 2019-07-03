const express = require('express');
const router = express.Router();
const pageSpeedService = require('../services/pageSpeedService'); 

router.get('/getPageSpeedPerformanceScoreForWebsites', pageSpeedService.getPageSpeedPerformanceScoreForWebsites);
router.get('/getPageSpeedPerformanceScoreForWebsite', pageSpeedService.getPageSpeedPerformanceScoreForWebsite);
router.get('/createPageSpeedPerformanceScoreForGccWebsites', pageSpeedService.createPageSpeedPerformanceScoreForGccWebsites);
router.get('/createPageSpeedPerformanceScoreForCompetitorWebsites', pageSpeedService.createPageSpeedPerformanceScoreForCompetitorWebsites);

module.exports = router;