const mongoose = require('mongoose');
const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "Ambala Cantt"
    unique: true
   
  },
  city: {
    type: String,
    required: true
  },
  landmark: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

const Stop = mongoose.model('Stop', stopSchema);
module.exports = Stop;
