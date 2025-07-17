const mongoose = require('mongoose');

const CollectorDataSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  rfid: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('collector_data', CollectorDataSchema, 'collector_data');