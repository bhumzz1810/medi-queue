const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const sendSMS = require("../utils/smsService"); // Utility function for SMS

const router = express.Router();

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "assignedDoctor clinic"
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Appointments for a Specific Clinic
router.get("/clinic/:clinicId", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const appointments = await Appointment.find({ clinic: clinicId }).populate(
      "assignedDoctor"
    );
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
});

// // Create a new appointment
// router.post("/book", async (req, res) => {
//   const { patientName, issue, clinicId } = req.body;

//   if (!clinicId) {
//     return res.status(400).json({ message: "Clinic selection is required" });
//   }

//   try {
//     const appointment = new Appointment({
//       patientName,
//       issue,
//       clinic: clinicId,
//       status: "pending",
//     });

//     await appointment.save();
//     res
//       .status(201)
//       .json({ message: "Appointment booked successfully", appointment });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // Assign a doctor to an appointment
// router.patch("/:id/assign", async (req, res) => {
//   const { doctorId } = req.body;

//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { assignedDoctor: doctorId, status: "confirmed" },
//       { new: true }
//     ).populate("assignedDoctor clinic");

//     res.json({ message: "Doctor assigned successfully", appointment });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// Book an appointment
router.post("/book", async (req, res) => {
  const { patientName, issue, clinicId, assignedDoctor, patientPhone } =
    req.body;

  if (!clinicId) {
    return res.status(400).json({ message: "Clinic selection is required" });
  }

  const existingAppointment = await Appointment.findOne({ patientPhone });
  if (existingAppointment) {
    return res.status(400).json({
      message:
        "This phone number has already been used for an appointment today.",
    });
  }

  try {
    const appointment = new Appointment({
      patientName,
      issue,
      clinic: clinicId,
      patientPhone, // Store patient's phone number for SMS notifications
      status: "pending",
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Accept or Reject Appointment
router.patch("/:id/decision", async (req, res) => {
  const { decision } = req.body; // Accept or Reject

  try {
    if (decision === "reject") {
      await Appointment.findByIdAndDelete(req.params.id);
      return res.json({ message: "Appointment rejected and removed" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment accepted", appointment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: error.message });
  }
});

// Assign a Doctor to an Appointment & Set Time
router.patch("/:appointmentId/assign", async (req, res) => {
  const { doctorId } = req.body;
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Assign available time slot
    const availableTimes = [
      "9:00 AM",
      "10:30 AM",
      "12:00 PM",
      "2:00 PM",
      "3:30 PM",
      "5:00 PM",
    ];
    const bookedTimes = await Appointment.find({
      assignedDoctor: doctorId,
    }).distinct("time");
    const time = availableTimes.find((t) => !bookedTimes.includes(t));

    if (!time) {
      return res.status(400).json({
        message:
          "No available time slots for this doctor today. Please try another doctor or day.",
      });
    }

    appointment.assignedDoctor = doctorId;
    appointment.status = "confirmed";
    appointment.time = time;
    await appointment.save();

    // Fetch doctor details for SMS
    const doctor = await Doctor.findById(doctorId);
    const doctorName = doctor ? doctor.name : "the assigned doctor";

    // Send SMS with appointment details including timing
    const message = `Your appointment with ${doctorName} is confirmed at ${time}.`;
    await sendSMS(appointment.patientPhone, message);

    res.status(200).json({
      message: "Doctor assigned, time set, and SMS sent",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
