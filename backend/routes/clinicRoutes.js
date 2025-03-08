const express = require("express");
const Clinic = require("../models/Clinic");

const router = express.Router();

// Get all clinics
router.get("/", async (req, res) => {
  try {
    const clinics = await Clinic.find().populate("doctors");
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new clinic
router.post("/", async (req, res) => {
  try {
    const { name, location } = req.body;
    const clinic = new Clinic({ name, location, doctors: [] });
    await clinic.save();
    res.status(201).json(clinic);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating clinic", error: error.message });
  }
});

router.get("/clinic", async (req, res) => {
  try {
    const clinicId = req.query.clinicId; // Clinic ID from request
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
router.get("/doctors/clinic", async (req, res) => {
  try {
    const clinicId = req.query.clinicId;
    const doctors = await Doctor.find({ clinic: clinicId });
    res.json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
});
router.patch("/appointments/:id/accept", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    res.json({ message: "Appointment accepted", appointment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting appointment", error: error.message });
  }
});
router.patch("/appointments/:id/accept", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    res.json({ message: "Appointment accepted", appointment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting appointment", error: error.message });
  }
});
router.patch("/doctors/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Doctor status updated", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating doctor status", error: error.message });
  }
});

module.exports = router;
