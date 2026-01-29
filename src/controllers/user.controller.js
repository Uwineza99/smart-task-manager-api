// Import users array
const users = require("../data/users");
//Import uuid to generate unique user id
const { v4: uuid4 } = require("uuid");
// Create a new user
const createUser = (req, res) => {
  //Get the name and email from the request body
  const { name, email } = req.body;

  // Check if your email and name are missing
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  //Check if the name is a string
  if (typeof name !== "string") {
    return res.status(400).json({ message: "name must be string" });
  }
  // Check if the email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Check if email already exists
  const emailExists = users.find((user) => user.email === email);
  if (emailExists) {
    return res.status(400).json({ message: "Email already in use" });
  }
  // User object
  const newUser = {
    id: uuid4(),
    name,
    email,
    createdAt: new Date(),
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
// Listing all users
const listUsers = (req, res) => {
  res.json(users);
};
// Check if the server is running
const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
};

// Export functions so routes can use them
module.exports = { createUser, listUsers, healthCheck };
