require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const templeRoutes = require('./routes/templeRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware Configurations
app.use(cors());
app.use(express.json());

// ... under app.use(express.json()) ...

// Temporary diagnostic check route rule definition
app.post("/api/slots/test", (req, res) => {
    res.status(200).json({ message: "Slots routing base path is working correctly!" });
});

app.use('/api/temples', templeRoutes);
app.use('/api/slots', slotRoutes);

// Mount API Routes
app.use('/api/temples', templeRoutes);
app.use('/api/slots', slotRoutes); // Handles matching targets down to /api/slots
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root Fallback Route
app.get("/", (req, res) => {
    res.send("DarshanEase API Running");
});

// Database Connection and Server Boot
connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server executing safely on port ${PORT}`);
});