// Import repository
const userRepo = require("../repositories/user.repo.js");

// Create a new user
const createUser = async (req, res) => {
  const { name, email, role } = req.body;

  // Validate required fields
  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Name, email and role are required",
    });
  }

  // Validate name type
  if (typeof name !== "string") {
    return res.status(400).json({
      message: "Name must be a string",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  try {
    // Check if email already exists (FROM DATABASE)
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }
    

    // Create user in database
    const createdUser = await userRepo.createUser({
      name,
      email,
      role,
    });

    res.status(201).json(createdUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// List all users
const listUsers = async (req, res) => {
  try {
    const users = await userRepo.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Health check
const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
};


// Export
module.exports = {
  createUser,
  listUsers,
  healthCheck,
};