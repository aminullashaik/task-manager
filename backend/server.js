const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", auth, projectRoutes);
app.use("/tasks", auth, taskRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB connected"))
.catch(err => console.error("DB Connection Error:", err));

app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});