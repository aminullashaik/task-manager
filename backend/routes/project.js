const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// create project
router.post("/", async (req, res) => {
  const { name, members, createdBy } = req.body;

  const project = new Project({ name, members, createdBy });
  await project.save();

  res.json({ message: "Project created", project });
});

// get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;