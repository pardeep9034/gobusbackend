const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedule");



const mongoose = require("mongoose");

// Create a new schedule
router.post("/", async (req, res) => {
  const { bus, date, departureTime, stopTimings, routeName, routeId } =
    req.body;

  if (!bus || !date || !departureTime || !stopTimings) {
    return res
      .status(400)
      .json({
        message: "Bus, date, departure time and stop timings are required",
      });
  }

  try {
    const schedule = new Schedule({
      bus,
      routeId,
      routeName,
      date,
      departureTime,
      stopTimings,
    });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate({
        path: "bus",
        select: "number type deckType amenities totalSeats", // include all fields you want from the bus
      })
      .populate({
        path: "stopTimings.stop",
        select: "name location",
      })
      .populate({
        path: "routeId",
        select: "stops",
      })
      .populate({
        path:"stopTimings.stopId"
      });

    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get schedule by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid schedule ID" });
  }

  try {
    const schedule = await Schedule.findById(id)
      .populate("bus", "number type")
      .populate("stopTimings.stop", "name location");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid schedule ID" });
  }

  try {
    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a schedule
router.put("/:id", async (req, res) => {
  console.log("Update schedule route hit");
  const { id } = req.params;
  const seats = req.body.bookedSeats;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid schedule ID" });
  }

  try {
    const schedule = await Schedule.findById(id);


    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    // Update the bookedSeats field
    schedule.bookedSeats.push(...seats);
    await schedule.save();
    console.log("Updated schedule:", schedule);

    res.json(schedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get('/:id/live-location', async (req, res) => {
  try {

    const schedule = await Schedule.findById(req.params.id)
      .populate('stopTimings.stopId');

    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const now = new Date();
    const today = new Date(schedule.date);
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 1. Not started
    if (today.toDateString() > now.toDateString() || currentTime < schedule.stopTimings[0].departureTime) {
      return res.json({
        status: 'not_started',
        nextStop: schedule.stopTimings[0].stop,
        coordinates: schedule.stopTimings[0].stopId.coordinates,
      });
    }

    // 2. Completed
    const lastStop = schedule.stopTimings[schedule.stopTimings.length - 1];
    if (currentTime > lastStop.arrivalTime) {
      return res.json({
        status: 'completed',
        message: 'Trip completed',
      });
    }

    // 3. In Progress: interpolate between stops
    for (let i = 0; i < schedule.stopTimings.length - 1; i++) {
      const current = schedule.stopTimings[i];
      const next = schedule.stopTimings[i + 1];

      if (currentTime >= current.departureTime && currentTime <= next.arrivalTime) {
        // Interpolate position between current and next stop
        const [h1, m1] = current.departureTime.split(':').map(Number);
        const [h2, m2] = next.arrivalTime.split(':').map(Number);
        const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);

        const [hNow, mNow] = currentTime.split(':').map(Number);
        const passedMinutes = (hNow * 60 + mNow) - (h1 * 60 + m1);
        const progress = passedMinutes / totalMinutes;

        const lat = current.stopId.coordinates.lat + (next.stopId.coordinates.lat - current.stopId.coordinates.lat) * progress;
        const lng = current.stopId.coordinates.lng + (next.stopId.coordinates.lng - current.stopId.coordinates.lng) * progress;

        return res.json({
          status: 'in_progress',
          currentStop: current.stop,
          nextStop: next.stop,
          estimatedArrival: next.arrivalTime,
          coordinates: { lat, lng },
          stops:schedule.stopTimings
        });
      }
    }

    res.status(400).json({ message: 'Unable to determine position.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
