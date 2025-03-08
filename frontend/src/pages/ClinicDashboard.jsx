import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaClipboardList,
  FaCheckCircle,
  FaHospital,
} from "react-icons/fa";
import logo from "../assets/logo.jpeg";

const ClinicDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");

  useEffect(() => {
    fetchClinics();
  }, []);

  useEffect(() => {
    if (selectedClinic) {
      fetchAppointments(selectedClinic);
      fetchDoctors(selectedClinic);
    }
  }, [selectedClinic]);

  // Fetch available clinics
  const fetchClinics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clinics");
      setClinics(res.data);
      if (res.data.length > 0) {
        setSelectedClinic(res.data[0]._id); // Default to first clinic
      }
    } catch (error) {
      console.error("Error fetching clinics", error);
    }
  };

  // Fetch appointments for selected clinic
  const fetchAppointments = async (clinicId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointments/clinic/${clinicId}`
      );
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  // Fetch doctors for selected clinic
  const fetchDoctors = async (clinicId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/doctors/clinic/${clinicId}`
      );
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  // Accept or Reject Appointment
  const handleDecision = async (appointmentId, decision) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/appointments/${appointmentId}/decision`,
        { decision }
      );
      setMessage(
        decision === "accept"
          ? "Appointment accepted"
          : "Appointment rejected and removed"
      );
      setShowPopup(true);
      fetchAppointments(selectedClinic);
    } catch (error) {
      setMessage("Error processing appointment");
    }
  };

  // Assign Doctor & Send SMS
  const assignDoctor = async (appointmentId, doctorId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/appointments/${appointmentId}/assign`,
        { doctorId }
      );
      setMessage("Doctor assigned and SMS sent");
      setShowPopup(true);
      fetchAppointments(selectedClinic);
    } catch (error) {
      setMessage("Error assigning doctor");
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-gradient-to-br from-blue-900 to-gray-800 text-black p-10">
      <motion.div
        className="w-full max-w-5xl bg-white bg-opacity-10 backdrop-blur-md p-10 rounded-lg shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center w-full">
          <img src={logo} alt="Medi-Queue Logo" className="h-24 mb-6" />
          <h2 className="text-4xl font-bold text-center mb-6">
            Clinic Dashboard
          </h2>
        </div>

        {/* Clinic Selection Dropdown */}
        <div className="mb-6 flex items-center space-x-4">
          <FaHospital className="text-2xl text-white" />
          <select
            className="p-3 border bg-white text-black rounded-lg"
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
          >
            {clinics.map((clinic) => (
              <option key={clinic._id} value={clinic._id}>
                {clinic.name} - {clinic.location}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p className="text-center text-green-400 mb-4">{message}</p>
        )}

        <h3 className="text-2xl font-bold flex items-center mb-4">
          <FaClipboardList className="mr-2" /> Appointments
        </h3>
        <ul className="space-y-4">
          {appointments.map((app) => (
            <li
              key={app._id}
              className="border p-4 rounded-lg bg-gray-100 shadow-md hover:bg-gray-200 transition-all text-black flex justify-between items-center"
            >
              <span>
                {app.patientName} - {app.issue} - Assigned to{" "}
                {app.assignedDoctor?.name || "Not Assigned"} -{" "}
                <strong> {app.status}</strong>
              </span>

              {app.status === "pending" && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleDecision(app._id, "accept")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(app._id, "reject")}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {app.status === "accepted" && (
                <select
                  onChange={(e) => assignDoctor(app._id, e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">Assign Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} - {doc.specialty}
                    </option>
                  ))}
                </select>
              )}
            </li>
          ))}
        </ul>
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
            <h3 className="text-2xl font-bold mb-2">Action Successful!</h3>
            <p className="text-lg mb-4">
              Your action has been successfully completed.
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

export default ClinicDashboard;
