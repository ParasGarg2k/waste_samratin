const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Store hashed passwords in production!
  role: { type: String, enum: ['customer', 'collector', 'admin'], required: true }
});

module.exports = mongoose.model('User', userSchema);