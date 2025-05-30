// models/Bus.js
const mongoose = require('mongoose');
const Route= require('./BusRoutes'); // Assuming you have a Route model defined

const busSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['AC', 'Non-AC', 'Volvo', 'Sleeper'], required: true },
  totalSeats: { type: Number, required: true },
  deckType: { type: String, enum: ['Single', 'Double'], default: 'Single' },
  amenities: { type: [String], enum: ['WiFi', 'Charging Port', 'Water Bottle', 'Blanket'], default: [] },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
});

module.exports = mongoose.model('Bus', busSchema);
