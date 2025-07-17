const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true },
  type: { type: String },
  unit: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SensorData', sensorDataSchema, 'sensor_data'); 