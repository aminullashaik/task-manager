const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// create task
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json({ message: "Task created", task });
});

// get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// update task status
router.patch("/:id", async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(task);
});

// dashboard
router.get("/dashboard", async (req, res) => {
  const total = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "done" });

  const overdue = await Task.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $ne: "done" }
  });

  res.json({ total, completed, overdue });
});

module.exports = router;