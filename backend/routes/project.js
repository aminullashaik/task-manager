const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// create project
router.post("/", async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;
    const project = new Project({ name, members, createdBy });
    await project.save();
    res.json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

module.exports = router;