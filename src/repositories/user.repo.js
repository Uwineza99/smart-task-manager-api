// Import database pool
const pool = require('../config/database');


// Create new user
exports.createUser = async ({ name, email, role }) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
    [name, email, role] // Safe parameterized values
  );

  return result.rows[0]; // Return created user
};


// Get all users
exports.getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows; // Return all users
};


// Find user by email (for duplicate check)
exports.findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0]; // Returns undefined if not found
};