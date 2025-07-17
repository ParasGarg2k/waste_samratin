const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const CollectorData = require('../models/collector_data');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-video', upload.single('video'), async (req, res) => {
  try {
    const { rfid } = req.body;
    if (!rfid) return res.status(400).json({ error: 'RFID is required' });
    if (!req.file) return res.status(400).json({ error: 'Video file is required' });

    const newEntry = new CollectorData({
      rfid,
      data: req.file.buffer 
    });
    await newEntry.save();
    res.json({ message: 'RFID and video saved to collector_data!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;