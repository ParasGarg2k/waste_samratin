const mongoose = require("mongoose");

const rfidSchema = new mongoose.Schema({
  epc: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

module.exports = mongoose.model("rfid", rfidSchema);