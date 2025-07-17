const express = require('express');
const { verifyToken } = require('./auth');
const collectorController = require('../controllers/collectorController');
const router = express.Router();

// Get all collectors
router.get('/', verifyToken, collectorController.getAllCollectors);

// Get collector by ID
router.get('/:id', verifyToken, collectorController.getCollectorById);

// Get collector attendance history
router.get('/:id/attendance', verifyToken, collectorController.getCollectorAttendance);

// Get collector complaints
router.get('/:id/complaints', verifyToken, collectorController.getCollectorComplaints);

// Get collector collection history
router.get('/:id/collection-history', verifyToken, collectorController.getCollectorCollectionHistory);

// Update collector
router.put('/:id', verifyToken, collectorController.updateCollector);

// Add attendance record
router.post('/:id/attendance', verifyToken, collectorController.addAttendanceRecord);

// Add collection record
router.post('/:id/collection', verifyToken, collectorController.addCollectionRecord);

// Add complaint against collector
router.post('/:id/complaints', verifyToken, collectorController.addComplaint);

// Get collector statistics
router.get('/:id/stats', verifyToken, collectorController.getCollectorStats);

module.exports = router; 