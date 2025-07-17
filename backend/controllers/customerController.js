const User = require('../models/User');
const WasteLog = require('../models/WasteLog');
const mongoose = require('mongoose');

// Get all customers with optional search, status, sorting
exports.getAllCustomers = async (req, res) => {
  try {
    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const customers = await User.find(query).sort(sort);
    res.json({ success: true, data: customers, total: customers.length });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get customer collection history (from WasteLog)
exports.getCustomerCollectionHistory = async (req, res) => {
  try {
    const logs = await WasteLog.find({ userId: req.params.id }).sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Get collection history error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get customer complaints (from WasteLog with feedback/complaint fields)
exports.getCustomerComplaints = async (req, res) => {
  try {
    // For demo, treat logs with feedback <= 3 as complaints
    const complaints = await WasteLog.find({ userId: req.params.id, feedback: { $lte: 3 } });
    res.json({ success: true, data: complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'customer' },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer updated successfully', data: updatedCustomer });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add collection record (WasteLog)
exports.addCollectionRecord = async (req, res) => {
  try {
    const { wasteAmount, accuracy, collectorId, imageUrl, feedback } = req.body;
    const log = new WasteLog({
      userId: req.params.id,
      collectorId,
      date: new Date(),
      wasteAmount,
      accuracy,
      feedback,
      imageUrl
    });
    await log.save();
    // Optionally update user's totalWaste, accuracy, lastCollection
    const logs = await WasteLog.find({ userId: req.params.id });
    const totalWaste = logs.reduce((sum, l) => sum + (l.wasteAmount || 0), 0);
    const avgAccuracy = logs.length ? (logs.reduce((sum, l) => sum + (l.accuracy || 0), 0) / logs.length) : 0;
    await User.findByIdAndUpdate(req.params.id, {
      totalWaste,
      accuracy: Math.round(avgAccuracy),
      lastCollection: new Date(),
      updatedAt: new Date()
    });
    res.json({ success: true, message: 'Collection record added successfully', data: log });
  } catch (error) {
    console.error('Add collection record error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add complaint (WasteLog with feedback <= 3)
exports.addComplaint = async (req, res) => {
  try {
    const { collectorId, description } = req.body;
    const log = new WasteLog({
      userId: req.params.id,
      collectorId,
      date: new Date(),
      wasteAmount: 0,
      accuracy: 0,
      feedback: 1, // Mark as complaint
      imageUrl: '',
      description
    });
    await log.save();
    res.json({ success: true, message: 'Complaint added successfully', data: log });
  } catch (error) {
    console.error('Add complaint error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get customer statistics
exports.getCustomerStats = async (req, res) => {
  try {
    const logs = await WasteLog.find({ userId: req.params.id });
    const totalCollections = logs.length;
    const averageWastePerCollection = totalCollections > 0 ? (logs.reduce((sum, l) => sum + (l.wasteAmount || 0), 0) / totalCollections).toFixed(2) : 0;
    const totalComplaints = logs.filter(l => l.feedback <= 3).length;
    const pendingComplaints = 0; // Add logic if you have complaint status
    const accuracyTrend = logs.slice(-5).map(l => l.accuracy);
    res.json({
      success: true,
      data: {
        totalCollections,
        averageWastePerCollection,
        totalComplaints,
        pendingComplaints,
        accuracyTrend
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 