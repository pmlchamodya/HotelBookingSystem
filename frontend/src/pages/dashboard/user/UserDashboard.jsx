import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  notifySuccess,
  notifyError,
} from "../../../components/alert/ToastContext";
import api from "../../../config/api";
import EyeIconShowPassword from "../../../components/icon/Eyeiconshowpassword";
import UserMyBookings from "./UserMyBookings";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // --- STATE: Edit Mode ---
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setProfileData({
          name: res.data.name,
          username: res.data.username,
          email: res.data.email,
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchUserProfile();
  }, []);

  // --- Handle Profile Update ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validate password match
    if (
      profileData.password &&
      profileData.password !== profileData.confirmPassword
    ) {
      notifyError("Passwords do not match!");
      return;
    }

    try {
      const dataToSend = { ...profileData };
      delete dataToSend.confirmPassword;

      // Remove empty password to prevent overwriting with blank
      if (!dataToSend.password) delete dataToSend.password;

      // Send update request
      await api.put("/user/profile", dataToSend);

      notifySuccess("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (err) {
      notifyError(err.response?.data?.msg || "Update Failed");
    }
  };

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
      notifySuccess("See you soon!");
    }, 100);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl relative overflow-hidden">
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
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab === "profile"
                ? "Profile Settings"
                : activeTab}
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
          {/* --- OVERVIEW SECTION --- */}
          {activeTab === "overview" && (
            <div className="animate-fade-in space-y-8">
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

          {/* --- MY BOOKINGS SECTION --- */}
          {activeTab === "bookings" && <UserMyBookings />}

          {/* --- MY PROFILE SECTION  --- */}
          {activeTab === "profile" && (
            <div className="animate-fade-in max-w-3xl">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <h3 className="text-xl font-bold text-slate-800">
                    Account Details
                  </h3>
                  {/* Toggle Edit Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
                      isEditing
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {isEditing ? "Cancel Edit" : "Edit Profile ✏️"}
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 font-medium">
                          {profileData.name}
                        </div>
                      )}
                    </div>

                    {/* Username Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                          value={profileData.username}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              username: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 font-medium">
                          {profileData.username}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 font-medium">
                        {profileData.email || "No Email Found"}
                      </div>
                    )}
                  </div>

                  {/* Password Fields */}
                  {isEditing && (
                    <div className="pt-4 border-t border-gray-100 animate-fade-in">
                      <p className="text-sm text-amber-600 font-bold mb-4">
                        Change Password (Optional)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EyeIconShowPassword
                          label="New Password"
                          name="password"
                          placeholder="Leave blank to keep current"
                          value={profileData.password}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              password: e.target.value,
                            })
                          }
                        />
                        <EyeIconShowPassword
                          label="Confirm New Password"
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          value={profileData.confirmPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition transform hover:-translate-y-0.5"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Reusable Components ---

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
