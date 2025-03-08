const mongoose = require("mongoose");

const ClinicSchema = new mongoose.Schema({
  name: String,
  location: String,
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
});

module.exports = mongoose.model("Clinic", ClinicSchema);
