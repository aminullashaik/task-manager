const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");

// create task (Admin only, or any logged in user based on current project setup. Let's support both)
router.post("/", async (req, res) => {
  try {
    let { title, description, projectId, assignedTo, dueDate } = req.body;
    
    // Ensure assignedTo is stored as an array of ObjectIds
    if (assignedTo) {
      if (!Array.isArray(assignedTo)) {
        assignedTo = [assignedTo];
      }
    } else {
      assignedTo = [];
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      status: "pending"
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("projectId", "name");

    res.json({ message: "Task created", task: populatedTask });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Error creating task" });
  }
});

// get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("lockedBy", "name email role")
      .populate("projectId", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// get tasks assigned to the logged in user
router.get("/my-tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("assignedTo", "name email role")
      .populate("lockedBy", "name email role")
      .populate("projectId", "name");
    res.json(tasks);
  } catch (err) {
    console.error("Get my tasks error:", err);
    res.status(500).json({ message: "Error fetching user tasks" });
  }
});

// lock a task
router.patch("/:id/lock", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if task is already locked by someone else
    if (task.isLocked && task.lockedBy.toString() !== req.user.id) {
      return res.status(400).json({ message: "Task is already locked by another user" });
    }

    task.isLocked = true;
    task.lockedBy = req.user.id;
    task.status = "working"; // Update status to working upon lock

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("lockedBy", "name email role")
      .populate("projectId", "name");

    res.json({ message: "Task locked successfully", task: populatedTask });
  } catch (err) {
    console.error("Lock task error:", err);
    res.status(500).json({ message: "Error locking task" });
  }
});

// unlock a task
router.patch("/:id/unlock", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if task is locked
    if (!task.isLocked) {
      return res.status(400).json({ message: "Task is not locked" });
    }

    // Only allow unlocking by the locker or an admin
    if (task.lockedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot unlock a task locked by someone else" });
    }

    task.isLocked = false;
    task.lockedBy = null;
    task.status = "pending"; // Reset status back to pending

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("lockedBy", "name email role")
      .populate("projectId", "name");

    res.json({ message: "Task unlocked successfully", task: populatedTask });
  } catch (err) {
    console.error("Unlock task error:", err);
    res.status(500).json({ message: "Error unlocking task" });
  }
});

// add a work entry
router.post("/:id/work-entry", async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ message: "Date and Time are required" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Verify task is locked by the current user
    if (!task.isLocked || !task.lockedBy || task.lockedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You must lock the task before adding work entries" });
    }

    // Fetch user name
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add entry
    task.workEntries.push({
      date,
      time,
      userName: user.name
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("lockedBy", "name email role")
      .populate("projectId", "name");

    res.json({ message: "Work entry added successfully", task: populatedTask });
  } catch (err) {
    console.error("Add work entry error:", err);
    res.status(500).json({ message: "Error adding work entry" });
  }
});

// complete a task
router.patch("/:id/complete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if task is locked by someone else
    if (task.isLocked && task.lockedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Task is locked by another user" });
    }

    task.status = "done";
    task.isLocked = false;
    task.lockedBy = null; // Auto-unlock upon completion

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("lockedBy", "name email role")
      .populate("projectId", "name");

    res.json({ message: "Task completed successfully", task: populatedTask });
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ message: "Error completing task" });
  }
});

// update task details (fallback/general update)
router.patch("/:id", async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle array convert if assignedTo is updated
    if (updateData.assignedTo) {
      if (!Array.isArray(updateData.assignedTo)) {
        updateData.assignedTo = [updateData.assignedTo];
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate("assignedTo", "name email role")
    .populate("lockedBy", "name email role")
    .populate("projectId", "name");

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// dashboard metrics
router.get("/dashboard", async (req, res) => {
  try {
    // If member, filter metrics to their tasks only. If admin, show all.
    const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
    
    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: "done" });
    const working = await Task.countDocuments({ ...query, status: "working" });
    const locked = await Task.countDocuments({ ...query, isLocked: true });

    const overdue = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    res.json({ total, completed, working, locked, overdue });
  } catch (err) {
    console.error("Dashboard metric error:", err);
    res.status(500).json({ message: "Error loading dashboard" });
  }
});

module.exports = router;
// Refresh status
