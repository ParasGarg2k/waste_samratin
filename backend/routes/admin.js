const express = require('express');
const { verifyToken } = require('./auth');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Rewards endpoints
router.get('/rewards', verifyToken, adminController.getAllRewards);
router.get('/rewards/:id', verifyToken, adminController.getRewardById);
router.post('/rewards', verifyToken, adminController.createReward);
router.put('/rewards/:id', verifyToken, adminController.updateReward);
router.delete('/rewards/:id', verifyToken, adminController.deleteReward);
router.get('/reward-analytics', verifyToken, adminController.getRewardAnalytics);

// Customer rewards endpoints
router.get('/eligible-customers', verifyToken, adminController.getEligibleCustomers);
router.post('/award-points/:customerId', verifyToken, adminController.awardPoints);
router.post('/redeem-reward/:customerId', verifyToken, adminController.redeemReward);

// System settings endpoints
router.get('/settings', verifyToken, adminController.getSettings);
router.put('/settings', verifyToken, adminController.updateSettings);

module.exports = router; 