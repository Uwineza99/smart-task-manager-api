// Import tasks array
const tasks = require("../data/tasks");

// Import users array
const users = require("../data/users");

//Import uuid to generate unique user id
const { v4: uuid4 } = require("uuid");

// Store data permanently
const fs = require("fs");
const path = require("path");

// Path to users.json file
const tasksFile = path.join(__dirname, "../data/tasks.json");

// Create a new task
const createTask = (req, res) => {
  //Get the name and email from the request body
  const { title, description, priority, assignedUserId } = req.body;

  // Check if your title, priority and assignedUserId are missing
  if (!title || !description || !priority || !assignedUserId) {
    return res
      .status(400)
      .json({
        message:
          "title, description, priority and assignedUserId need to be filled",
      });
  }

  // Setting priorities
  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return res
      .status(400)
      .json({ message: "Priority must be low, medium, or high" });
  }

  // Check if assigned user exists
  const userExists = users.find((u) => u.id === assignedUserId);
  if (!userExists) {
    return res.status(400).json({ message: "Assigned user doesn't exist" });
  }

  // Check if the title already exists
  const TaskExists = tasks.find((task) => task.title === title);
  if (TaskExists) {
    return res.status(400).json({ message: "Task title already exist" });
  }

  // User object
  const newTask = {
    id: uuid4(),
    title,
    description,
    status: "todo",
    priority,
    assignedUserId,
    createdAt: new Date(),
  };
  tasks.push(newTask);

  // Save users back to file
fs.writeFileSync(
  path.join(__dirname, '../data/tasks.json'),
  JSON.stringify(tasks, null, 2)
);
  res.status(201).json(newTask);
};
// Listing all tasks
const listTasks = (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile, "utf8"));
  res.json(tasks);
};

// Updating tasks
const updateTask = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check if task is found using id
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ message: "Task is not found" });
  }

  // How status flows
  const statusFlow = {
    todo: ["in_progress"],
    in_progress: ["done"],
    done: [],
  };

  // Checking if status is valid
  if (!statusFlow[task.status].includes(status)) {
    return res.status(404).json({ message: "Invalid status" });
  }

// Updating the task
  task.status = status;

// Save to tasks.json
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  res.json(task);
};
// Export functions so routes can use them
module.exports = {
  createTask,
  listTasks,
  updateTask,
};
