//Import express
const express = require('express');

// Import user routes
const userRoutes = require('./routes/user.routes');

// Starting the app
const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Creating users route
app.use('/users', userRoutes);

// Health endpoints
app.use('/health', (req, res) => {
   res.json({status: 'ok', uptime: process.uptime() }); 
});

// Export app to make it accessible
module.exports = app;