import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserMd, FaHospital, FaClipboardList } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchClinics();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clinics");
      setClinics(res.data);
    } catch (error) {
      console.error("Error fetching clinics", error);
    }
  };

  return (
    <motion.div
      className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-800 to-indigo-900 text-white flex flex-col items-center p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <img src={logo} alt="Medi-Queue Logo" className="h-20 mb-6" />
      <h2 className="text-5xl font-extrabold text-center mb-12 text-indigo-300 drop-shadow-lg">
        Admin Dashboard
      </h2>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        {/* Appointments */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white text-black p-8 rounded-xl shadow-2xl border border-blue-300"
        >
          <h3 className="text-2xl font-bold flex items-center mb-6 text-blue-600">
            <FaClipboardList className="mr-3" /> Appointments
          </h3>
          <ul className="space-y-4">
            {appointments.map((app) => (
              <li
                key={app._id}
                className="border p-5 rounded-lg bg-gray-100 shadow-md hover:bg-gray-300 transition-all"
              >
                {app.patientName} -{" "}
                <strong className="text-blue-600">{app.status}</strong>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Doctors */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white text-black p-8 rounded-xl shadow-2xl border border-green-300"
        >
          <h3 className="text-2xl font-bold flex items-center mb-6 text-green-600">
            <FaUserMd className="mr-3" /> Doctors
          </h3>
          <ul className="space-y-4">
            {doctors.map((doc) => (
              <li
                key={doc._id}
                className="border p-5 rounded-lg bg-gray-100 shadow-md hover:bg-gray-300 transition-all"
              >
                {doc.name} - {doc.specialty} -{" "}
                <strong className="text-green-600">{doc.status}</strong>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Clinics */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white text-black p-8 rounded-xl shadow-2xl border border-red-300"
        >
          <h3 className="text-2xl font-bold flex items-center mb-6 text-red-600">
            <FaHospital className="mr-3" /> Clinics
          </h3>
          <ul className="space-y-4">
            {clinics.map((clinic) => (
              <li
                key={clinic._id}
                className="border p-5 rounded-lg bg-gray-100 shadow-md hover:bg-gray-300 transition-all"
              >
                {clinic.name} - {clinic.location}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
