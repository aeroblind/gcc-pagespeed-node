const express = require('express');
const router = express.Router();
const pageSpeedService = require('../services/pageSpeedService'); 

router.get('/createPageSpeedPerformanceScoreForGccWebsites', pageSpeedService.createPageSpeedPerformanceScoreForGccWebsites);
router.get('/createPageSpeedPerformanceScoreForCompetitorWebsites', pageSpeedService.createPageSpeedPerformanceScoreForCompetitorWebsites);

module.exports = router;