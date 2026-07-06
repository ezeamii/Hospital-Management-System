/* global process */
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// ===========================
// REGISTER USER OR DOCTOR
// ===========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization, department } = req.body;

    // Check if user or doctor already exists
    const existingUser = await User.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });

    if (existingUser || existingDoctor) {
      return res.status(400).json({ message: "⚠️ Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "doctor") {
      // Save doctor to Doctor collection
      newUser = new Doctor({
        name,
        email,
        password: hashedPassword,
        specialization,
        department,
      });
    } else {
      // Default: Save patient to User collection
      newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "patient",
      });
    }

    await newUser.save();

    res.status(201).json({ message: "✅ Registration successful!" });
  } catch (err) {
    console.error("Error in registration:", err.message);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// ===========================
// LOGIN USER OR DOCTOR
// ===========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try finding user in both collections
    let user = await User.findOne({ email });
    let role = "patient";

    if (!user) {
      user = await Doctor.findOne({ email });
      if (user) role = "doctor";
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "❌ User not found. Please register first." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid password." });
    }

    // JWT secret from env
    const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey123";

    // Generate token (include name so we can read it later)
    const token = jwt.sign(
      { id: user._id, role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
