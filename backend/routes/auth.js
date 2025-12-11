import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    // Check if email already exists
    let userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Create new user instance
    user = new User({
      name,
      username,
      email,
      password,
      role: role || "customer",
    });

    // Encrypt (Hash) Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save to Database
    await user.save();

    // Generate JWT Token
    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate JWT Token
    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
