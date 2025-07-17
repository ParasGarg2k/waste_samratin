const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  pointsRequired: { type: Number, required: true },
  discount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  customersEligible: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  totalRedeemed: { type: Number, default: 0 }
});

module.exports = mongoose.model('Reward', rewardSchema, 'rewards'); 