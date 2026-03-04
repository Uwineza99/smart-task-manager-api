// Import database connection
const db = require('../connection');


// Create new user
exports.createUser = async (data) => {
  return db.table("users").create(data);
};

// Get all users
exports.getAllUsers = async () => {
  return db.table("users").get();
};


// Find user by email (for duplicate check)
exports.findUserByEmail = async (email) => {
  return db
    .table("users")
    .findOne({ email });
};