require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RFID = require("./models/RFID");

const MONGO_URI = process.env.MONGO_URI;
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const verifyRoutes = require('./routes/verify');



const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://jpmc25:jpmc25@demo.vy7ku.mongodb.net/waste_samaritan?retryWrites=true&w=majority&appName=Demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);

// Video upload routes
app.use('/api', uploadRoutes);

app.use('/api', verifyRoutes);

// RFID GET endpoint

app.get("/api/rfid", async (req, res) => {
  try {
    const rfids = await mongoose.connection.db.collection("rfid").find({}).toArray();
    console.log(rfids)
    res.json(rfids);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RFID data" });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await mongoose
     .connection
      .db
      .collection("collector_data")
      .find({
        rfid: { $in: ["RFID111225", "RFID111226"] },
        dry_waste: { $exists: true, $ne: null }
      })
      .toArray();
    console.log(logs)
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RFID data" });
  }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

