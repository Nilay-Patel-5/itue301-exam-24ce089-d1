const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// CORS Middleware
app.use(cors());

// Global Request Logger Middleware
const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api/v1', apiRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'FitZone Gym & Class Booking System API is running...',
    version: 'v1'
  });
});

// Global Error Handler Middleware (MUST BE LAST)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
