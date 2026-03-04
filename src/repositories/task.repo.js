// Import database connection
const db = require('../connection');

// Create task
exports.createTask = async (data) => {
  return db.table("tasks").create(data);
};
// Get all tasks
exports.getAllTasks = async () => {
  return db.table("tasks").get();
};

// Find task by user ID
exports.findTaskById = async (id) => {

  // findById already applies WHERE id = $1 and LIMIT 1
  return db
    .table("tasks")
    .findById(id);
};

// Find task by title (for duplicate check)
exports.findTaskByTitle = async (title) => {

  // WHERE title = $1 LIMIT 1
  return db
    .table("tasks")
    .findOne({ title })
    // .findOne();
};

// Find user by ID (used before assigning task)
exports.findUserById = async (id) => {

  // Query users table
  return db
    .table("users")
    .findById(id);
};
// Update task status
exports.updateTaskStatus = async (id, status) => {

  // Update status column where id matches
  await db
    .table("tasks")
    .where({ id })
    .update({ status });

  // Return updated task
  return db
    .table("tasks")
    .findById(id);
};