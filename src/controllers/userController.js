const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });

  return token;
};

//cookie check
const cookieCheck=(req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }
    req.user = decoded;
    res.status(200).json({ message: "Token is valid", user: decoded });
  });

 
}

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, phone, dob, city, pincode } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({ name, email, password, phone, dob, city, pincode });
    await newUser.save();

    // Generate JWT token
    generateToken(res, newUser._id);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    generateToken(res, user._id);
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false, // false for localhost; true for production
    sameSite: "lax", // 'lax' for local; 'none' for production cross-site
    expires: new Date(0), // Ensures the cookie is immediately expired
  });
  res.status(200).json({ message: "User logged out successfully" });
};

const findUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const user = await User.findById(id); // simpler and correct
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Find user error:", error.message);
    res.status(400).json({ message: "Invalid user ID", error: error.message });
  }
};



// ✅ Correct Export
module.exports = {findUser, registerUser, loginUser, logoutUser,cookieCheck };
