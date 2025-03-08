import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-4">Medi-Queue</h2>
      <ul>
        <li className="mb-2">
          <Link to="/patient-dashboard" className="hover:text-gray-400">
            Patient Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/admin-dashboard" className="hover:text-gray-400">
            Admin Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/clinic-dashboard" className="hover:text-gray-400">
            Clinic Dashboard
          </Link>
        </li>
        <li className="mt-5">
          <button
            onClick={() => localStorage.clear()}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
