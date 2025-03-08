import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaStethoscope, FaPhone, FaCheckCircle } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

const PatientDashboard = () => {
  const [name, setName] = useState("");
  const [issue, setIssue] = useState("");
  const [phone, setPhone] = useState("");
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchClinics();
  }, []);

  // Fetch available clinics
  const fetchClinics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clinics");
      setClinics(res.data);
    } catch (error) {
      console.error("Error fetching clinics", error);
    }
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!selectedClinic) {
      setMessage("Please select a clinic.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          patientName: name,
          issue,
          clinicId: selectedClinic,
          patientPhone: phone,
        }
      );
      setMessage(res.data.message);
      setShowPopup(true);
      // Clear form after booking
      setName("");
      setIssue("");
      setPhone("");
      setSelectedClinic("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-blue-800 to-green-900 text-white">
      <motion.div
        className="w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md p-12 rounded-lg shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Medi-Queue Logo" className="h-30 mb-6" />
          <FaStethoscope className="text-5xl text-white bg-green-600 p-3 rounded-full" />
          <h2 className="text-4xl font-bold mt-4 text-black">
            Book an Appointment
          </h2>
        </div>
        {message && (
          <p className="text-green-400 text-center mb-4">{message}</p>
        )}
        <input
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-black"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-black"
          placeholder="Health Issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <input
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-black"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={selectedClinic}
          onChange={(e) => setSelectedClinic(e.target.value)}
        >
          <option value="">Select Nearest Clinic</option>
          {clinics.map((clinic) => (
            <option key={clinic._id} value={clinic._id}>
              {clinic.name} - {clinic.location}
            </option>
          ))}
        </select>
        <motion.button
          className="w-full bg-green-600 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-md"
          onClick={bookAppointment}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Now
        </motion.button>
      </motion.div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white text-black p-8 rounded-lg shadow-xl flex flex-col items-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
            <h3 className="text-2xl font-bold mb-2">Appointment Booked!</h3>
            <p className="text-lg mb-4">
              Your appointment has been successfully scheduled.
            </p>
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-green-700 transition-all"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
