import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate(
        res.data.role === "admin"
          ? "/admin-dashboard"
          : res.data.role === "clinic"
          ? "/clinic-dashboard"
          : "/patient-dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-blue-800 to-purple-900">
      <motion.div
        className="w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md p-12 rounded-lg shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Medi-Queue Logo" className="h-30 mb-4" />
          <FaUser className="text-5xl text-white bg-purple-600 p-3 rounded-full" />
          <h2 className="text-4xl font-bold mt-4 text-black">Login</h2>
        </div>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <input
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-4 border border-gray-300 bg-white bg-opacity-20 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <motion.button
          className="w-full bg-purple-600 py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition-all shadow-md"
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
        <p className="text-center mt-6 text-black">
          Don't have an account?
          <span
            className="text-purple-800 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            {" "}
            Register here
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
