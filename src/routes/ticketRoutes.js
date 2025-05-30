const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

//get all tickets by id
router.get("/:id", async (req, res) => {
    const userId= req.params.id;
    console.log(userId);
    try {
        const tickets = await Ticket.find().populate("bus")
        const filteredTickets = tickets.filter(ticket => ticket.user.toString() === userId);
        console.log("Filtered Tickets:", filteredTickets);
        res.status(200).json(filteredTickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
})

module.exports = router;
