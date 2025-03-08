const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Doctors for a Specific Clinic
router.get("/clinic/:clinicId", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const doctors = await Doctor.find({ clinic: clinicId });
    res.json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
});

// Update doctor status (Available, Busy, Off)
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating doctor status", error: error.message });
  }
});

module.exports = router;
