import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      navigate("/"); // Redirect to login after successful registration
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-green-700 to-blue-900">
      <motion.div
        className="w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md p-12 rounded-lg shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Medi-Queue Logo" className="h-30 mb-4" />

          <FaUserPlus className="text-5xl text-white bg-green-600 p-3 rounded-full" />
          <h2 className="text-4xl font-bold mt-4 text-black">Register</h2>
        </div>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <input
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="patient">Patient</option>
          <option value="clinic">Clinic</option>
          <option value="admin">Admin</option>
        </select>
        <motion.button
          className="w-full bg-green-600 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-md text-white"
          onClick={handleRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>
        <p className="text-center mt-6 text-black">
          Already have an account?
          <span
            className="text-green-800 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            {" "}
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
