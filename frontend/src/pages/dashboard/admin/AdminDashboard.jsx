import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-800">
          🏨 Admin Panel
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <div className="text-gray-400 text-xs uppercase font-semibold mb-2">
            Main
          </div>
          <button className="w-full text-left px-4 py-3 bg-blue-800 rounded-lg font-medium">
            Dashboard
          </button>

          <div className="text-gray-400 text-xs uppercase font-semibold mt-6 mb-2">
            Management
          </div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded transition">
            👥 Users
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded transition">
            🛏️ Rooms
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded transition">
            📅 Bookings
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded transition">
            🏊 Facilities
          </button>

          <div className="text-gray-400 text-xs uppercase font-semibold mt-6 mb-2">
            Communication
          </div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded transition">
            📩 Inquiries
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded transition">
            ⭐ Reviews
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Welcome,{" "}
            <span className="font-bold text-blue-900">
              {user?.name || "Admin"}
            </span>
          </div>
        </header>

        {/* Stats Cards (Placeholders) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Active Bookings</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm">Rooms Available</h3>
            <p className="text-2xl font-bold">08</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm">New Inquiries</h3>
            <p className="text-2xl font-bold">05</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
          <p>Select a module from the sidebar to manage.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
