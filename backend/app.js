require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 8000; // Use port 8000 for backend

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || true, // Allow all origins in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, 'localhost', () => {
  console.log(`Backend server running on localhost:${PORT}`);
});

module.exports = app;
