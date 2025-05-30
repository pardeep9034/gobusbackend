const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");
const Stop = require("../models/Stop");
const BusRoute = require("../models/BusRoute");
const Schedule = require("../models/schedule");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");
const mongoose = require("mongoose");

router.get("/:from/:to/:date", async (req, res) => {
    const { from, to, date } = req.params;
    try {
        
    
        const schedules = await Schedule.find({
        busId: { $in: busIds },
        date,
        }).populate("busId");
    
        if (!schedules || schedules.length === 0) {
        return res.status(404).json({ message: "No schedules found" });
        }
    
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    })