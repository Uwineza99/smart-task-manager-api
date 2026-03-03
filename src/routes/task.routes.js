// Import express
const express = require("express");

// router that defines routes
const router = express.Router();

//Import controller functions
const {
  createTask,
  listTasks,
  updateTask,
} = require("../controllers/task.controller");

//Create a new task
router.post("/", createTask);

//Listing all tasks
router.get("/", listTasks);

//Updating tasks
router.patch("/:id", updateTask);

//Export router so that app.js can use it
module.exports = router;
