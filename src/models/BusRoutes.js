const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Example: "Delhi to Chandigarh"
    unique: true
  },
  stops: [
    {
      stop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
        required: true
      },
      order: {
        type: Number, // Determines stop sequence
        required: true
      },
      fareFromStart: {
        type: Number, // Fare from the first stop to this stop
        required: true
      }
    }
  ]
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
