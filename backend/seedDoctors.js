/* global process */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";

dotenv.config();

// ===== CONNECT TO MONGO EXACTLY LIKE server.js =====
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB for seeding");
} catch (err) {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
}

// ===== DOCTORS SEED DATA =====
const doctors = [
  {
    name: "Dr. Mitchell Starc",
    email: "starc@zamcare.com",
    password: "doctor123",
    specialization: "Cardiology",
  },
  {
    name: "Dr. Thomas Zoltan",
    email: "zoltan@zamcare.com",
    password: "doctor123",
    specialization: "Dermatology",
  },
  {
    name: "Dr. Kate Smith",
    email: "smith@zamcare.com",
    password: "doctor123",
    specialization: "Neurology",
  },
  {
    name: "Dr. Hannah Kovács",
    email: "kovacs@zamcare.com",
    password: "doctor123",
    specialization: "Pediatrics",
  },
  {
    name: "Dr. Robert Farkas",
    email: "farkas@zamcare.com",
    password: "doctor123",
    specialization: "General Medicine",
  },
];

// ===== SEEDING LOGIC =====
const seedDoctors = async () => {
  try {
    await Doctor.deleteMany();

    for (let doc of doctors) {
      const hashedPassword = await bcrypt.hash(doc.password, 10);
      await Doctor.create({ ...doc, password: hashedPassword });
    }

    console.log("✅ Doctors seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding doctors:", err.message);
    process.exit(1);
  }
};

seedDoctors();
