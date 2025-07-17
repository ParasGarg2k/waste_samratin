const User = require('../models/User');
const CollectorData = require('../models/CollectorData');
const WasteLog = require('../models/WasteLog');
const mongoose = require('mongoose');

// Get all collectors with optional search, status, sorting
exports.getAllCollectors = async (req, res) => {
  try {
    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = { role: 'collector' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { assignedArea: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const collectors = await User.find(query).sort(sort);
    res.json({ success: true, data: collectors, total: collectors.length });
  } catch (error) {
    console.error('Get collectors error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get collector by ID
exports.getCollectorById = async (req, res) => {
  try {
    const collector = await User.findOne({ _id: req.params.id, role: 'collector' });
    if (!collector) {
      return res.status(404).json({ success: false, message: 'Collector not found' });
    }
    res.json({ success: true, data: collector });
  } catch (error) {
    console.error('Get collector error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get collector attendance history (from CollectorData)
exports.getCollectorAttendance = async (req, res) => {
  try {
    const attendance = await CollectorData.find({ collectorId: req.params.id }).sort({ date: -1 });
    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get collector complaints (from WasteLog with feedback <= 3)
exports.getCollectorComplaints = async (req, res) => {
  try {
    const complaints = await WasteLog.find({ collectorId: req.params.id, feedback: { $lte: 3 } });
    res.json({ success: true, data: complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get collector collection history (from CollectorData)
exports.getCollectorCollectionHistory = async (req, res) => {
  try {
    const history = await CollectorData.find({ collectorId: req.params.id }).sort({ date: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Get collection history error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update collector
exports.updateCollector = async (req, res) => {
  try {
    const updatedCollector = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'collector' },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedCollector) {
      return res.status(404).json({ success: false, message: 'Collector not found' });
    }
    res.json({ success: true, message: 'Collector updated successfully', data: updatedCollector });
  } catch (error) {
    console.error('Update collector error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add attendance record (CollectorData)
exports.addAttendanceRecord = async (req, res) => {
  try {
    const { status, checkIn, checkOut, housesVisited, wasteCollected, complaints, route } = req.body;
    const record = new CollectorData({
      collectorId: req.params.id,
      date: new Date(),
      status,
      checkIn,
      checkOut,
      housesVisited,
      wasteCollected,
      complaints,
      route
    });
    await record.save();
    res.json({ success: true, message: 'Attendance record added successfully', data: record });
  } catch (error) {
    console.error('Add attendance record error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add collection record (CollectorData)
exports.addCollectionRecord = async (req, res) => {
  try {
    const { housesVisited, wasteCollected, complaints, route } = req.body;
    const record = new CollectorData({
      collectorId: req.params.id,
      date: new Date(),
      housesVisited,
      wasteCollected,
      complaints,
      route
    });
    await record.save();
    res.json({ success: true, message: 'Collection record added successfully', data: record });
  } catch (error) {
    console.error('Add collection record error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add complaint against collector (WasteLog with feedback <= 3)
exports.addComplaint = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const log = new WasteLog({
      userId,
      collectorId: req.params.id,
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

// Get collector statistics
exports.getCollectorStats = async (req, res) => {
  try {
    const history = await CollectorData.find({ collectorId: req.params.id });
    const totalCollections = history.length;
    const averageWastePerDay = totalCollections > 0 ? (history.reduce((sum, h) => sum + (h.wasteCollected || 0), 0) / totalCollections).toFixed(2) : 0;
    const totalComplaints = history.reduce((sum, h) => sum + (h.complaints || 0), 0);
    const attendanceRate = totalCollections > 0 ? (history.filter(h => h.attendance === 'present').length / totalCollections * 100).toFixed(2) : 0;
    const averageHousesPerDay = totalCollections > 0 ? (history.reduce((sum, h) => sum + (h.housesVisited || 0), 0) / totalCollections).toFixed(2) : 0;
    res.json({
      success: true,
      data: {
        totalCollections,
        averageWastePerDay,
        totalComplaints,
        attendanceRate,
        averageHousesPerDay
      }
    });
  } catch (error) {
    console.error('Get collector stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 