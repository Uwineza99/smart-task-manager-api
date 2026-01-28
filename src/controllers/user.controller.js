// Import users array
const users = require('../data/users');
//Import uuid to generate unique user id
const { v4: uuid4 } = require('uuid');
// Create a new user
const createUser = (req, res) => {
    //Get the name and email from the request body
    const { name, email } = req.body;

    // Check if your email and name are missing
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email required' });
    }
    // User object
    const newUser = {
        id: uuid4(),
        name,
        email,
        createdAt: new Date()
    };
users.push(newUser);
res.status(201).json(newUser);
};
// Listing all users
const listUsers = (req, res) => {
    res.json(users);
}
// Check if the server is running
const healthCheck = (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime()
    });
};

// Export functions so routes can use them
module.exports = { createUser, listUsers, healthCheck };