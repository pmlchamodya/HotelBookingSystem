import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

//  GET /api/user/profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // req.user.id comes from the authentication middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//  PUT /api/user/profile
router.put("/profile", authenticateToken, async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update fields if provided
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;

    // Hash and update password only if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Return the updated user data (excluding password)
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
