const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String }, // Only for admin/collector login
  role: { type: String, enum: ['customer', 'collector', 'admin'], required: true },
  address: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  rewards: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  totalWaste: { type: Number, default: 0 },
  feedback: { type: Number, default: 0 },
  lastCollection: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema, 'users2'); 