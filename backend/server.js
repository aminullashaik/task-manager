const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

// Resolve the path to the frontend dist folder
const frontendPath = path.resolve(__dirname, "../frontend/dist");
console.log(`[Server] Attempting to serve static files from: ${frontendPath}`);

// Serve static files with caching
app.use(express.static(frontendPath, {
  maxAge: '1d', // Cache for 1 day
  etag: true
}));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    path: frontendPath
  });
});

app.use("/auth", authRoutes);
app.use("/projects", auth, projectRoutes);
app.use("/tasks", auth, taskRoutes);

// Catch-all route to serve the frontend index.html for SPA routing
app.get("*", (req, res) => {
  if (!req.path.startsWith("/auth") && !req.path.startsWith("/projects") && !req.path.startsWith("/tasks")) {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  }
});

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => console.log("DB connected"))
.catch(err => {
  console.error("DB Connection Error:", err.message);
  // Don't exit, but we'll know it failed
});

app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
