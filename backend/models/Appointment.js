const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  issue: String,
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "confirmed"],
    default: "pending",
  },
  patientPhone: { type: String, required: true }, // Ensure patientPhone is required
  time: { type: String, default: null }, // Store appointment time when assigned
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
