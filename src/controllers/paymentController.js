const Ticket=require('../models/Ticket');

const createPayment = async (req, res) => {
    try {
        const { ticket } = req.body;
        

        // Save the ticket to the database
        const newTicket = new Ticket(ticket);
        await newTicket.save();

        // Send a response back to the client
        res.status(201).json({ message: 'Payment created successfully', ticket: newTicket, success: true });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createPayment,
};