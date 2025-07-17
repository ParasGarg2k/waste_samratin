const express = require('express');
const { verifyToken } = require('./auth');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

// Dashboard root returns overview
router.get('/', verifyToken, dashboardController.getOverview);

// Dashboard overview
router.get('/overview', verifyToken, dashboardController.getOverview);

// Weekly statistics
router.get('/weekly-stats', verifyToken, dashboardController.getWeeklyStats);

// Waste type distribution
router.get('/waste-distribution', verifyToken, dashboardController.getWasteDistribution);

// Recent activity
router.get('/recent-activity', verifyToken, dashboardController.getRecentActivity);

// Performance metrics
router.get('/performance', verifyToken, dashboardController.getPerformance);

module.exports = router; 