const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Use the raw MongoDB collection for flexibility
const collection = () => mongoose.connection.db.collection('collector_data');

// GET: Fetch by RFID
router.get('/verify/:rfid', async (req, res) => {
  try {
    const rfid = req.params.rfid;
    const entry = await collection().findOne({ rfid });
    if (!entry) return res.status(404).json({ error: 'RFID not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update by RFID
// ... existing code ...
// PUT: Update by RFID
router.put('/verify/:rfid', async (req, res) => {
  try {
    const rfid = req.params.rfid;
    const update = req.body;
    const result = await collection().findOneAndUpdate(
      { rfid },
      { $set: update },
      { returnDocument: 'after' }
    );

    // More robust check: The result might be the document itself, or in result.value
    const updatedDocument = result.value || result;

    if (!updatedDocument) {
      return res.status(404).json({ error: 'RFID not found' });
    }
    
    res.json(updatedDocument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

