import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
    fullName: {type: String, required: true,},
    email: {type: String,required: true,},
    phone: {type: String,required: true,},
    doctor: {type: String,required: true, },
    department: {type: String,required: true,},
    location: {type: String,required: true,},
    date: {type: Date,required: true,},
    time: { type: String, required: true },
    diagnosis: {type: String, default: "",},
    status: {type: String, enum: ["Pending", "Completed", "Cancelled"],default: "Pending",},
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
