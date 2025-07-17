const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  wasteAmount: { type: Number, required: true },
  accuracy: { type: Number },
  feedback: { type: Number },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WasteLog', wasteLogSchema, 'wastelogs'); 