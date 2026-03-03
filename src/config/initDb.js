// Import database connection pool
const pool = require('./database');

// Function to create tables
const initDb = async () => {
  try {

    // Create USERS table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,        -- Auto-increment user ID
        name TEXT NOT NULL,           -- User full name
        email TEXT UNIQUE NOT NULL,   -- Email must be unique
        role TEXT NOT NULL            -- User role (admin, mentor, student)
      );
    `);

    // Create TASKS table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,            -- Auto-increment task ID
        title TEXT UNIQUE NOT NULL,       -- Task title (must be unique)
        description TEXT NOT NULL,        -- Task details
        status TEXT DEFAULT 'todo',       -- Default status
        priority TEXT NOT NULL,           -- Task priority
        assigned_user_id INTEGER,         -- Links task to user
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Auto timestamp

        -- Foreign key connects task to user
        FOREIGN KEY (assigned_user_id) REFERENCES users(id)
      );
    `);

    console.log("Tables created successfully");

  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Run function
initDb();