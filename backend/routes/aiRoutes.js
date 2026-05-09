const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/autopsy', aiController.analyzeAutopsy);
router.post('/tod', aiController.estimateTOD);
router.post('/digital', aiController.correlateDigital);
router.post('/risk', aiController.scoreRisk);
router.post('/summary', aiController.generateSummary);

module.exports = router;
