// routes/buses.js
const express = require('express');
const router = express.Router();
const Bus = require('../models/Buses');

router.post('/', async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    await newBus.save();
    res.status(201).json(newBus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find().populate('route');
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
