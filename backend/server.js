/* global process */
/* eslint-env node */

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // these are my frontend dev URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Start the Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
