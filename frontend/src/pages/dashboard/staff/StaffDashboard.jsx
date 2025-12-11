import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-green-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-green-800">
          🛎️ Staff Panel
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-green-800 rounded-lg font-medium">
            Dashboard
          </button>

          <div className="text-gray-400 text-xs uppercase font-semibold mt-6 mb-2">
            Tasks
          </div>
          <button className="w-full text-left px-4 py-2 hover:bg-green-800 rounded transition">
            📅 View Bookings
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-green-800 rounded transition">
            📩 Customer Inquiries
          </button>
        </nav>

        <div className="p-4 border-t border-green-800">
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
          <h1 className="text-3xl font-bold text-gray-800">Staff Workspace</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            User:{" "}
            <span className="font-bold text-green-900">{user?.username}</span>{" "}
            (Staff)
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Today's Check-ins</h3>
            <p className="text-2xl font-bold">05</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Pending Inquiries</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
          <p className="text-gray-600">No new urgent notifications.</p>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
