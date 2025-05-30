const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  cookieCheck,
  findUser,
} = require("../controllers/userController.js");
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/checkCookie",cookieCheck ); 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/:id", findUser);
// router.get("/profile", protect, (req, res) => res.json(req.user));

module.exports =router;
