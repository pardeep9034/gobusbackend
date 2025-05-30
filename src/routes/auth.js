const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Devloper = require("../models/UserDev");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register
router.post("/dev/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await Devloper.create({ email, password: hashed });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Devloper.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  res
    .cookie("devtoken", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200).json({ message: "Logged in successfully" });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

// Profile
router.get("/profile", (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    res.json({ id: decoded.id });
  });
});

module.exports = router;
