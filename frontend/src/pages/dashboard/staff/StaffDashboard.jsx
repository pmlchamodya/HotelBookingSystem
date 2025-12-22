import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../../components/alert/ToastContext";
import StaffBooking from "./StaffBooking";
import StaffInquiry from "./StaffInquiry";
import StaffRooms from "./StaffRooms";
import StaffFacilities from "./StaffFacilities";

const StaffDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
      notifySuccess("Logged out successfully!");
    }, 100);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-green-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 text-2xl font-extrabold tracking-wider border-b border-green-800 flex items-center gap-3">
          <span>🛎️</span> STAFF PANEL
        </div>

        <nav className="flex-grow p-6 space-y-3">
          <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-2">
            Overview
          </p>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-5 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
              activeTab === "dashboard"
                ? "bg-green-700 text-white shadow-lg shadow-green-900/50 translate-x-1"
                : "text-green-100 hover:bg-green-800/50 hover:translate-x-1"
            }`}
          >
            <span className="text-xl">📊</span> Dashboard
          </button>

          <p className="text-xs font-bold text-green-300 uppercase tracking-widest mt-6 mb-2">
            Tasks
          </p>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`w-full text-left px-5 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
              activeTab === "rooms"
                ? "bg-green-700 text-white shadow-lg shadow-green-900/50 translate-x-1"
                : "text-green-100 hover:bg-green-800/50 hover:translate-x-1"
            }`}
          >
            <span className="text-xl">🏨</span> Rooms
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left px-5 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
              activeTab === "bookings"
                ? "bg-green-700 text-white shadow-lg shadow-green-900/50 translate-x-1"
                : "text-green-100 hover:bg-green-800/50 hover:translate-x-1"
            }`}
          >
            <span className="text-xl">📅</span> Manage Bookings
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className="w-full text-left px-5 py-3.5 rounded-xl font-medium text-green-100 hover:bg-green-800/50 hover:translate-x-1 transition-all flex items-center gap-3"
          >
            <span className="text-xl">📩</span> Inquiries
          </button>
          <button
            onClick={() => setActiveTab("facilities")}
            className={`w-full text-left px-5 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
              activeTab === "facilities"
                ? "bg-green-700 text-white shadow-lg shadow-green-900/50 translate-x-1"
                : "text-green-100 hover:bg-green-800/50 hover:translate-x-1"
            }`}
          >
            <span className="text-xl">🏊</span> Facilities
          </button>
        </nav>

        <div className="p-6 border-t border-green-800 bg-green-950/30">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg shadow-lg transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {activeTab === "dashboard"
              ? "Staff Workspace"
              : `${activeTab} Management`}
          </h1>
          <div className="bg-green-50 px-4 py-2 rounded-lg text-green-900 font-medium shadow-sm border border-green-100">
            User: <span className="font-bold">{user?.username}</span> (Staff)
          </div>
        </header>

        {/* ---  DASHBOARD STATS --- */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-green-500 hover:shadow-xl transition-shadow">
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Today's Check-ins
              </h3>
              <p className="text-4xl font-extrabold text-green-700 mt-2">05</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-blue-500 hover:shadow-xl transition-shadow">
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Pending Inquiries
              </h3>
              <p className="text-4xl font-extrabold text-blue-700 mt-2">12</p>
            </div>

            <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📌 Recent Notifications
              </h2>
              <p className="text-gray-500">No new urgent notifications.</p>
            </div>
          </div>
        )}

        {/* ---  ROOMS MANAGEMENT --- */}
        {activeTab === "rooms" && (
          <div className="animate-fade-in">
            <StaffRooms />
          </div>
        )}
        {/* ---  BOOKINGS MANAGEMENT --- */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in">
            <StaffBooking />
          </div>
        )}
        {/* ---  INQUIRIES MANAGEMENT --- */}
        {activeTab === "inquiries" && (
          <div className="animate-fade-in">
            <StaffInquiry />
          </div>
        )}
        {/* ---  FACILITIES MANAGEMENT --- */}
        {activeTab === "facilities" && (
          <div className="animate-fade-in">
            <StaffFacilities />
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
