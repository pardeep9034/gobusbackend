const express= require("express");
const router = express.Router();
// const Bus = require("./models/BusRoutes");
// const Stop = require("../models/Stop");
const Route = require("../models/BusRoutes");
// const { verifyToken } = require("../middleware/authMiddleware");
// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Types;
// const { calculateDistance } = require("../utils/distanceCalculator");
// const { calculateFare } = require("../utils/fareCalculator");

// Create a new route
router.post("/", async (req, res) => {
  const { name, stops } = req.body;

  if (!name || !stops || stops.length === 0) {
    return res.status(400).json({ message: "Name and stops are required" });
  }

  try {
    const route = new Route({ name, stops });
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get all routes
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find().populate("stops.stop");
    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;