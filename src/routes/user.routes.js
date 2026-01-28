// Import express
const express = require('express');

// router that defines routes
const router = express.Router();

//Import controller functions
const { createUser, listUsers, healthCheck } = require('../controllers/user.controller');

//Health check endpoint
router.get('/health', healthCheck);

//Create a new user
router.post('/', createUser);

//Listing all users
router.get('/', listUsers);

//Export router so that app.js can use it
module.exports = router;