// Import database connection
const pool = require('../config/database');

// Create task
exports.createTask = async (taskData) => {
  const {title, description, priority, assignedUserId} = taskData;
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority, assigned_user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, priority, assignedUserId]
  );

  return result.rows[0]; // return new task
};

// Get all tasks
exports.getAllTasks = async () => {
  const result = await pool.query('SELECT * FROM tasks');
  return result.rows;
};

// Find task by ID
exports.findTaskById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1',
    [id]
  );

  return result.rows[0];
};

// Find task by title (for duplicate check)
exports.findTaskByTitle = async (title) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE title = $1',
    [title]
  );

  return result.rows[0];
};

// Find user by ID (used before assigning task)
exports.findUserById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0];
};

// Update task status
exports.updateTaskStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE tasks 
     SET status = $1 
     WHERE id = $2 
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};