const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  bookingId: { type: String, required: true },
  pnr: { type: String, required: true },
  seats: [String], // e.g., ['A1', 'A2']
  date: { type: Date, required: true },
  fromArrivalTime: { type: String, required: true },
  toArrivalTime: { type: String, required: true },
  from: String,
  to: String,
  duration: String,
  amount:
    {
      fare: { type: Number, required: true },
      seatsFare: { type: Number, required: true },
      gst: { type: Number, required: true },
      totalFare: { type: Number, required: true },
    },
  
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
