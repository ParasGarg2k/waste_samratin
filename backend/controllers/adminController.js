const Reward = require('../models/Reward');
const User = require('../models/User');

// Get all rewards
exports.getAllRewards = async (req, res) => {
  try {
    const { isActive } = req.query;
    let filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    const rewards = await Reward.find(filter);
    res.json({
      success: true,
      data: rewards,
      total: rewards.length
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get reward by ID
exports.getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findOne({ id: req.params.id });
    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }
    res.json({ success: true, data: reward });
  } catch (error) {
    console.error('Get reward error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create new reward
exports.createReward = async (req, res) => {
  try {
    const { name, description, pointsRequired, discount } = req.body;
    const count = await Reward.countDocuments();
    const newReward = new Reward({
      id: `R${String(count + 1).padStart(3, '0')}`,
      name,
      description,
      pointsRequired: parseInt(pointsRequired),
      discount: parseFloat(discount),
      isActive: true,
      customersEligible: 0,
      createdAt: new Date(),
      totalRedeemed: 0
    });
    await newReward.save();
    res.status(201).json({ success: true, message: 'Reward created successfully', data: newReward });
  } catch (error) {
    console.error('Create reward error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update reward
exports.updateReward = async (req, res) => {
  try {
    const updatedReward = await Reward.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedReward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }
    res.json({ success: true, message: 'Reward updated successfully', data: updatedReward });
  } catch (error) {
    console.error('Update reward error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete reward
exports.deleteReward = async (req, res) => {
  try {
    const deleted = await Reward.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }
    res.json({ success: true, message: 'Reward deleted successfully' });
  } catch (error) {
    console.error('Delete reward error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get eligible customers for rewards
exports.getEligibleCustomers = async (req, res) => {
  try {
    const { minAccuracy = 80 } = req.query;
    const customers = await User.find({ 
      role: 'customer', 
      accuracy: { $gte: parseInt(minAccuracy) },
      status: 'active'
    }).select('name email accuracy totalWaste rewards lastCollection');
    
    const eligibleCustomers = customers.map(customer => ({
      id: customer._id,
      customerName: customer.name,
      accuracy: customer.accuracy || 0,
      totalWaste: customer.totalWaste || 0,
      currentPoints: customer.rewards || 0,
      lastReward: customer.lastCollection ? customer.lastCollection.toISOString().split('T')[0] : null
    }));

    res.json({
      success: true,
      data: eligibleCustomers,
      total: eligibleCustomers.length
    });
  } catch (error) {
    console.error('Get eligible customers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Award points to customer
exports.awardPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    const customer = await User.findById(req.params.customerId);
    
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer.rewards = (customer.rewards || 0) + parseInt(points);
    await customer.save();

    res.json({
      success: true,
      message: `${points} points awarded successfully`,
      data: {
        customerId: req.params.customerId,
        newPoints: customer.rewards,
        reason
      }
    });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Redeem reward for customer
exports.redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const customer = await User.findById(req.params.customerId);
    const reward = await Reward.findOne({ id: rewardId });
    
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (!reward.isActive) {
      return res.status(400).json({ success: false, message: 'Reward is not active' });
    }

    if ((customer.rewards || 0) < reward.pointsRequired) {
      return res.status(400).json({ success: false, message: 'Insufficient points' });
    }

    // Deduct points
    customer.rewards -= reward.pointsRequired;
    customer.lastCollection = new Date();
    await customer.save();

    // Update reward stats
    reward.totalRedeemed += 1;
    await reward.save();

    res.json({
      success: true,
      message: 'Reward redeemed successfully',
      data: {
        reward: reward.name,
        pointsSpent: reward.pointsRequired,
        remainingPoints: customer.rewards
      }
    });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reward analytics
exports.getRewardAnalytics = async (req, res) => {
  try {
    const rewards = await Reward.find();
    const customers = await User.find({ role: 'customer' });
    
    const totalRewards = rewards.length;
    const activeRewards = rewards.filter(r => r.isActive).length;
    const totalRedemptions = rewards.reduce((sum, r) => sum + (r.totalRedeemed || 0), 0);
    const totalPointsAwarded = customers.reduce((sum, c) => sum + (c.rewards || 0), 0);
    
    const analytics = {
      totalRewards,
      activeRewards,
      totalRedemptions,
      totalPointsAwarded,
      topRewards: rewards
        .sort((a, b) => (b.totalRedeemed || 0) - (a.totalRedeemed || 0))
        .slice(0, 5)
        .map(r => ({
          name: r.name,
          redemptions: r.totalRedeemed || 0
        })),
      monthlyStats: [
        { month: 'Jan', rewards: 45, points: 12500 },
        { month: 'Feb', rewards: 52, points: 14200 },
        { month: 'Mar', rewards: 48, points: 13800 },
        { month: 'Apr', rewards: 61, points: 16800 },
        { month: 'May', rewards: 55, points: 15200 },
        { month: 'Jun', rewards: 67, points: 18500 }
      ]
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get reward analytics error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get system settings
exports.getSettings = async (req, res) => {
  try {
    const settings = {
      pointsPerKg: 10,
      accuracyBonusMultiplier: 1.5,
      minAccuracyForRewards: 80,
      emailNotifications: true,
      smsNotifications: false,
      rewardAlerts: true,
      systemVersion: 'v2.1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      databaseStatus: 'Connected',
      apiStatus: 'Online'
    };

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update system settings
exports.updateSettings = async (req, res) => {
  try {
    // In a real application, you would update the database
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: req.body
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 