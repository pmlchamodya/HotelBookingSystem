import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    // Main Container: Flexbox layout, full height, light gray background
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* --- Sidebar Section --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
        {/* Sidebar Header */}
        <div className="p-6 text-center border-b border-gray-700">
          <h2 className="text-2xl font-bold tracking-wider text-blue-400">
            HOTEL ADMIN
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => alert("Dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition duration-200 flex items-center text-gray-300 hover:text-white"
          >
            📊 <span className="ml-3 font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => alert("Manage Rooms")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition duration-200 flex items-center text-gray-300 hover:text-white"
          >
            🛏️ <span className="ml-3 font-medium">Manage Rooms</span>
          </button>
          <button
            onClick={() => alert("Bookings")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition duration-200 flex items-center text-gray-300 hover:text-white"
          >
            📅 <span className="ml-3 font-medium">Bookings</span>
          </button>
          <button
            onClick={() => alert("Users")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition duration-200 flex items-center text-gray-300 hover:text-white"
          >
            👥 <span className="ml-3 font-medium">Users</span>
          </button>
        </nav>

        {/* Logout Button Area */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200 font-semibold shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Welcome back,{" "}
              <span className="text-blue-600 font-semibold">
                {user?.name || "Admin"}
              </span>
              !
            </p>
          </div>
          <div className="text-right">
            <span className="bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full border border-blue-100">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Rooms */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Total Rooms
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-3xl font-extrabold text-gray-800">12</p>
              <span className="text-2xl">🏨</span>
            </div>
          </div>

          {/* Card 2: Active Bookings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Active Bookings
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-3xl font-extrabold text-gray-800">5</p>
              <span className="text-2xl">✅</span>
            </div>
          </div>

          {/* Card 3: Pending Requests */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Pending Requests
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-3xl font-extrabold text-gray-800">3</p>
              <span className="text-2xl">⏳</span>
            </div>
          </div>

          {/* Card 4: Total Income */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Total Income
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-3xl font-extrabold text-gray-800">$1,200</p>
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">
            Recent Bookings
          </h2>
          <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-lg">No recent bookings found.</p>
            <p className="text-sm text-gray-400 mt-1">
              New bookings will appear here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
