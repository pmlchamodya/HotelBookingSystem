import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../../components/alert/ToastContext";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
      notifySuccess("See you soon!");
    }, 100);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR (Luxury Style) --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl relative overflow-hidden">
        {/* Background Texture (Optional decoration) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        <div className="p-8 text-center border-b border-slate-800 z-10">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-3xl font-bold text-slate-900 mx-auto mb-3 shadow-lg shadow-amber-500/20">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold tracking-wide text-white">
            Hello, {user?.name || "Guest"}
          </h2>
          <p className="text-xs text-amber-500 uppercase tracking-widest mt-1">
            Loyal Member
          </p>
        </div>

        <nav className="flex-grow p-6 space-y-2 z-10">
          <SidebarBtn
            label="Overview"
            icon="🏠"
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarBtn
            label="My Bookings"
            icon="📅"
            isActive={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          />
          <SidebarBtn
            label="My Profile"
            icon="👤"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <SidebarBtn
            label="Reviews"
            icon="⭐"
            isActive={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
          />
        </nav>

        <div className="p-6 border-t border-slate-800 z-10">
          <button
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 group"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm py-6 px-10 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 capitalize">
              {activeTab === "overview" ? "Dashboard Overview" : activeTab}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome to your personal space
            </p>
          </div>

          <div className="flex gap-4">
            <button
              className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-amber-600 transition"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </header>

        <div className="p-10">
          {/* --- VIEW 1: OVERVIEW --- */}
          {activeTab === "overview" && (
            <div className="animate-fade-in space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Stays"
                  value="03"
                  icon="🏨"
                  color="blue"
                />
                <StatCard
                  title="Loyalty Points"
                  value="1,250"
                  icon="👑"
                  color="amber"
                />
                <StatCard
                  title="Upcoming Trip"
                  value="Dec 25"
                  icon="✈️"
                  color="green"
                />
              </div>

              {/* Banner Area */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-amber-500/10 transform skew-x-12"></div>
                <h3 className="text-3xl font-serif font-bold mb-4 relative z-10">
                  Plan Your Next Getaway
                </h3>
                <p className="text-gray-300 max-w-xl mb-8 relative z-10">
                  Experience world-class luxury at exclusive member rates. Your
                  next adventure awaits at King of Asia.
                </p>
                <button className="bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-white transition relative z-10 shadow-lg shadow-amber-500/30">
                  Book a Room Now
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 2: MY BOOKINGS (Member 3 Area) --- */}
          {activeTab === "bookings" && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center py-20">
                <div className="text-6xl mb-6 opacity-20">📅</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  My Bookings
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  This section will display your booking history and upcoming
                  reservations. (To be implemented by Booking Manager - Member
                  3)
                </p>
                <div className="inline-block px-6 py-3 bg-gray-100 rounded-lg text-sm text-gray-600 font-mono border border-gray-200">
                  &lt;BookingTable /&gt; component goes here
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW 3: PROFILE --- */}
          {activeTab === "profile" && (
            <div className="animate-fade-in max-w-2xl">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
                  My Account Details
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Full Name
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                        {user?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Username
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                        {user?.username}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                      {user?.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Role
                    </label>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-end">
                  <button className="text-slate-500 hover:text-slate-800 text-sm font-medium underline">
                    Request Password Change
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Reusable Components for User Dashboard ---

const SidebarBtn = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-4 ${
      isActive
        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 transform scale-105"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="tracking-wide">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    green: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <div
      className={`p-6 rounded-2xl border ${colors[color]} flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase opacity-60">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default UserDashboard;
