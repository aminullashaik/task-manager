const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hash,
    role: email === "aminullashaik18@gmail.com" ? "admin" : (role === "admin" ? "member" : (role || "member"))
  });

  await user.save();

  res.json({ message: "User created" });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret"
  );

  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// get all users
router.get("/users", async (req, res) => {
  const users = await User.find({}, "name email role");
  res.json(users);
});

module.exports = router;