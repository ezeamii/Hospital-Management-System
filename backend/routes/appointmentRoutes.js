import express from "express";
import Appointment from "../models/Appointment.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js"; 

const router = express.Router();

/* ============================================================
   CREATE Appointment (patient booking)
============================================================ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { doctor, date, time, department, location, phone } = req.body;

    if (!doctor || !date || !time || !department || !location || !phone) {
      return res
        .status(400)
        .json({ message: "⚠️ All fields (including phone) are required." });
    }

    // Get user so we can fill fullName & email
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent a doctor from having two appointments at the same date and time
    const existingDoctorAppointment = await Appointment.findOne({
      doctor,
      date: new Date(date),
      time,
      status: { $ne: "Cancelled" }
    });

    if (existingDoctorAppointment) {
      return res.status(400).json({
        message: "Time slot already taken"
      });
    }

    const newAppointment = new Appointment({
      userId: req.user.id,
      fullName: user.name,
      email: user.email,
      phone,
      doctor,
      department,
      location,
      date,
      time,
      status: "Pending",
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "✅ Appointment booked successfully!",
      data: newAppointment,
    });
  } catch (err) {
    console.error("❌ Error saving appointment:", err.message);
    res.status(500).json({ error: "Failed to save appointment." });
  }
});


/* ============================================================
   GET Patient’s Appointments
============================================================ */
router.get("/", verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });
    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});

/* ============================================================
   CANCEL Appointment  (Patient)
============================================================ */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "Cancelled" },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Appointment not found." });

    res.json({ success: true, message: "Appointment cancelled.", data: updated });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to cancel appointment." });
  }
});

/* ============================================================
   UPDATE Appointment (Patient)
============================================================ */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Appointment not found." });

    res.json({ success: true, message: "Appointment updated.", data: updated });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to update appointment." });
  }
});

/* ============================================================
   GET Appointments for Logged-in Doctor
============================================================ */
router.get("/doctor", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied. Doctors only." });
    }

    // Doctor name from Doctor collection
    const doctorRecord = await Doctor.findById(req.user.id);
    if (!doctorRecord) {
      return res.status(404).json({ message: "Doctor record not found." });
    }

    const doctorName = doctorRecord.name; // <-- This matches the string in Appointment.doctor

    const appointments = await Appointment.find({ doctor: doctorName })
      .populate("userId", "name email")
      .sort({ date: 1 });

    res.json({ success: true, data: appointments });

  } catch (err) {
    console.error("Error fetching doctor's appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});


/* ============================================================
   MARK Completed (Doctor)
============================================================ */
router.put("/complete/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Access denied. Doctors only.",
      });
    }

    const { diagnosis } = req.body; // <-- capture diagnosis

    // Find doctor record so we can get doctor's NAME
    const doctorRecord = await Doctor.findById(req.user.id);
    if (!doctorRecord) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const doctorName = doctorRecord.name;

    // Update the appointment WHERE:
    // - The appointment ID matches
    // - The doctor name matches
    const updated = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: doctorName },
      { status: "Completed", diagnosis },   // <-- save diagnosis
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({
      success: true,
      message: "Appointment marked as completed with diagnosis.",
      data: updated,
    });

  } catch (err) {
    console.error("Error updating appointment:", err.message);
    res.status(500).json({ error: "Failed to update appointment." });
  }
});





export default router;
