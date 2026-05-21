const mongoose = require("mongoose");

const workEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  userName: { type: String, required: true }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, default: "pending" },
  dueDate: Date,
  isLocked: { type: Boolean, default: false },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  workEntries: [workEntrySchema]
});

module.exports = mongoose.model("Task", taskSchema);
