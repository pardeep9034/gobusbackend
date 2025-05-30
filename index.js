const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cookieParser = require('cookie-parser');


dotenv.config();

// Connect to MongoDB
connectDB();
const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors(
    {
        origin: `${frontendUrl}`,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', require('./src/routes/userRoutes')); 
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/tickets', require('./src/routes/ticketRoutes'));
// app.use('/api/home', require('./src/routes/homeRoutes'));
//dev routes
// Auth routes
const authRoutes = require("./src/routes/auth");
app.use("/api/auth", authRoutes);
// Stops routes
const stopsRoutes = require("./src/routes/stops");
app.use("/api/stops", stopsRoutes);
// Bus route routes
const busRoutes = require("./src/routes/busRoutes");
app.use("/api/routes", busRoutes);
// Buses routes
const busesRoutes = require("./src/routes/buses");
app.use("/api/buses", busesRoutes);
// Schedule routes
const scheduleRoutes = require("./src/routes/schedule");

app.use("/api/schedule", scheduleRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));