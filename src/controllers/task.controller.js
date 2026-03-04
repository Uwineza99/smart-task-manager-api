// Import repository
const taskRepo = require("../repositories/task.repo.js");

//Import uuid to generate unique user id
const { v4: uuid4 } = require("uuid");

// Create a new task
const createTask = async (req, res) => {
  console.log(req.body);
  //Get the name and email from the request body
  const { title, description, priority, assignedUserId } = req.body;
  // Required fields
  const requiredFields = {
    title,
    description,
    priority,
    assignedUserId
  };
  // Find the missing field
  const missingField = Object.entries(requiredFields)
    .find(([Key, value]) => !value);
  if (missingField) {
    return res
      .status(400)
      .json({
        message: `${missingField[0]} is required`,

      });
  }

  // Setting priorities
  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return res
      .status(400)
      .json({ message: "Priority must be low, medium, or high" });
  }
  try {
    // Check if assigned user exists (FROM DATABASE)
    const userExists = await taskRepo.findUserById(assignedUserId);
    if (!userExists) {
      return res.status(400).json({ message: "Assigned user doesn't exist" });
    }

    // Check if the title already exists
    const taskExists = await taskRepo.findTaskByTitle(title);
    if (taskExists) {
      return res.status(400).json({ message: "Task title already exist" });
    }

    // User object
    const newTask = {
      title,
      description,
      status: "todo",
      priority,
      assigned_user_id: assignedUserId,
    };

    // Save to DB using repository
    const createdTask = await taskRepo.createTask(newTask);
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Listing all tasks
const listTasks = async (req, res) => {
  try {
    const tasks = await taskRepo.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updating tasks
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // How status flows
  const statusFlow = {
    todo: ["in_progress"],
    in_progress: ["done"],
    done: [],
  };

  try {
    const task = await taskRepo.findTaskById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!statusFlow[task.status].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedTask = await taskRepo.updateTaskStatus(id, status);

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Export functions so routes can use them
module.exports = {
  createTask,
  listTasks,
  updateTask,
};
