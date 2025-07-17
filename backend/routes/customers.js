const express = require('express');
const { verifyToken } = require('./auth');
const customerController = require('../controllers/customerController');
const router = express.Router();

// Get all customers
router.get('/', verifyToken, customerController.getAllCustomers);

// Get customer by ID
router.get('/:id', verifyToken, customerController.getCustomerById);

// Get customer collection history
router.get('/:id/collection-history', verifyToken, customerController.getCustomerCollectionHistory);

// Get customer complaints
router.get('/:id/complaints', verifyToken, customerController.getCustomerComplaints);

// Update customer
router.put('/:id', verifyToken, customerController.updateCustomer);

// Add collection record
router.post('/:id/collection', verifyToken, customerController.addCollectionRecord);

// Add complaint
router.post('/:id/complaints', verifyToken, customerController.addComplaint);

// Get customer statistics
router.get('/:id/stats', verifyToken, customerController.getCustomerStats);

module.exports = router; 