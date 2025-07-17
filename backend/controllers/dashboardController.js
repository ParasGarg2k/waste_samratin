const User = require('../models/User');
const CollectorData = require('../models/CollectorData');
const WasteLog = require('../models/WasteLog');

// Dashboard Overview
exports.getOverview = async (req, res) => {
  try {
    const [totalCustomers, totalCollectors, totalWaste, avgAccuracy, pendingComplaints, todayCollections] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'collector' }),
      WasteLog.aggregate([{ $group: { _id: null, total: { $sum: '$wasteAmount' } } }]),
      WasteLog.aggregate([{ $group: { _id: null, avg: { $avg: '$accuracy' } } }]),
      WasteLog.countDocuments({ feedback: { $lte: 3 } }),
      WasteLog.countDocuments({ date: { $gte: new Date(new Date().setHours(0,0,0,0)) } })
    ]);
    // Add landfill and recycle percentage
    const landfillPercentage = 62;
    const recyclePercentage = 38;
    res.json({
      success: true,
      data: {
        totalCustomers,
        totalCollectors,
        totalWasteCollected: totalWaste[0]?.total || 0,
        averageAccuracy: avgAccuracy[0]?.avg ? avgAccuracy[0].avg.toFixed(2) : 0,
        pendingComplaints,
        todayCollections,
        landfillPercentage,
        recyclePercentage
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Weekly Stats (last 7 days)
exports.getWeeklyStats = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const stats = await WasteLog.aggregate([
      { $match: { date: { $gte: weekAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%a', date: '$date' } },
        waste: { $sum: '$wasteAmount' },
        accuracy: { $avg: '$accuracy' },
        collections: { $sum: 1 }
      } },
      { $sort: { '_id': 1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Waste Type Distribution (dummy, as no type field in WasteLog)
exports.getWasteDistribution = async (req, res) => {
  try {
    // If you have a type field, aggregate by type
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get waste distribution error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Recent Activity (last 10 logs)
exports.getRecentActivity = async (req, res) => {
  try {
    const logs = await WasteLog.find().sort({ date: -1 }).limit(10);
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Performance Metrics (example)
exports.getPerformance = async (req, res) => {
  try {
    const [avgFeedback, avgAccuracy, totalCollections, resolvedComplaints] = await Promise.all([
      WasteLog.aggregate([{ $group: { _id: null, avg: { $avg: '$feedback' } } }]),
      WasteLog.aggregate([{ $group: { _id: null, avg: { $avg: '$accuracy' } } }]),
      WasteLog.countDocuments(),
      WasteLog.countDocuments({ feedback: { $gt: 3 } })
    ]);
    res.json({
      success: true,
      data: {
        customerSatisfaction: avgFeedback[0]?.avg || 0,
        accuracyRate: avgAccuracy[0]?.avg || 0,
        totalCollections,
        resolvedComplaints
      }
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 