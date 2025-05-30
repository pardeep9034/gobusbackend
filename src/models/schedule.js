// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  date: { type: Date, required: true },
  routeName: { type: String, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  departureTime: { type: String, required: true },
  stopTimings: [
    {
      stop:{type:String,required:true}, 
      stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true },
      arrivalTime: { type: String },
      departureTime: { type: String },
    },
  ],
  bookedSeats: { type: [String], default: [] },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
