const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  status: {
    type: String,
    enum: ["available", "busy", "off"],
    default: "available",
  },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
