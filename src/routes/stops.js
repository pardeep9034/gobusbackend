const express = require('express');
const router = express.Router();
const Stop = require('../models/Stops');

// GET all stops
router.get('/', async (req, res) => {
    const allStops = await Stop.find();
    res.json(allStops);
});

// POST a new stop
router.post('/', async (req, res) => {
  const stop = new Stop(req.body);
  await stop.save();
  res.status(201).json(stop);
});

// DELETE a stop
router.delete('/:id', async (req, res) => {
  await Stop.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router; // ✅ Export router
