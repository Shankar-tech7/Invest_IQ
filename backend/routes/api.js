const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// User & Auth Routes
router.get('/user/profile', userController.getProfile);
router.post('/user/profile', userController.updateProfile);
router.get('/user/settings', userController.getSettings);
router.post('/user/settings', userController.updateSettings);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Mock Autopsy NLP Analysis
router.post('/autopsy/analyze', (req, res) => {
  setTimeout(() => {
    res.json({
      cause: "Blunt force trauma to the occipital region",
      confidence: 94.2,
      toxicology: "Trace amounts of benzodiazepines detected",
      injuries: ["Fractured C4 vertebra", "Contusions on bilateral forearms (defensive)"],
      anomalies: "Livor mortis pattern inconsistent with reported body position."
    });
  }, 2000);
});

// Mock Time of Death
router.post('/time-of-death/estimate', (req, res) => {
  setTimeout(() => {
    res.json({
      estimatedTime: "14 - 18 hours ago",
      window: "Between 2:00 AM and 6:00 AM",
      confidence: 88.5,
      factors: "Accelerated cooling due to low environmental temperature."
    });
  }, 1500);
});

// Mock CCTV Analysis
router.post('/cctv/analyze', (req, res) => {
  setTimeout(() => {
    res.json({
      match: "Marcus Thorne",
      confidence: 98.2,
      timestamp: "11/04/24 23:41:02",
      location: "North Alley Cam 04"
    });
  }, 2500);
});

// Mock Chatbot
router.post('/chat', (req, res) => {
  const { message } = req.body;
  setTimeout(() => {
    res.json({
      reply: "Processing query... Cross-referencing case files. Anomalies detected in recent CCTV footage match your description."
    });
  }, 1000);
});

module.exports = router;
