const express = require('express');
const router = express.Router();
const pageSpeedService = require('../services/pageSpeedService'); 

router.get('/createPageSpeedPerformanceScoreForAllUrls', pageSpeedService.createPageSpeedPerformanceScoreForAllUrls);
router.get('/test', pageSpeedService.test);

module.exports = router;