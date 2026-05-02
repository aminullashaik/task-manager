const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// create task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// update task status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "done" });

    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    res.json({ total, completed, overdue });
  } catch (err) {
    res.status(500).json({ message: "Error loading dashboard" });
  }
});

module.exports = router;