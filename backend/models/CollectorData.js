const mongoose = require('mongoose');

const collectorDataSchema = new mongoose.Schema({
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  housesVisited: { type: Number, default: 0 },
  wasteCollected: { type: Number, default: 0 },
  complaints: { type: Number, default: 0 },
  route: { type: String },
  attendance: { type: String, enum: ['present', 'absent', 'on_leave'], default: 'present' },
  checkIn: { type: String },
  checkOut: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CollectorData', collectorDataSchema, 'collector_data'); 