const express = require('express');
const router = express.Router();
const pageSpeedService = require('../services/pageSpeedService'); 

router.get('/createPageSpeedPerformanceScoreForAllUrls', pageSpeedService.createPageSpeedPerformanceScoreForAllUrls);

router.post('/createPageSpeedPerformanceScore', pageSpeedService.createPageSpeedPerformanceScore);
router.post('/start', pageSpeedService.start);
router.post('/stop', pageSpeedService.stop);


module.exports = router;