import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  notifySuccess,
  notifyError,
  notifyConfirm,
} from "../../../components/alert/ToastContext";
import api from "../../../config/api";
import EyeIconShowPassword from "../../../components/icon/Eyeiconshowpassword";
import AdminBooking from "./AdminBooking";
import AdminInquiry from "./AdminInquiry";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATES ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [staffFormData, setStaffFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // --- FETCH DATA (UPDATED) ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [activeTab, refreshKey]);

  const customerList = users.filter((u) => u.role === "customer");
  const staffList = users.filter((u) => u.role === "staff");

  // --- HANDLE FORM SUBMIT (ADD OR UPDATE) ---
  const handleSubmitStaff = async (e) => {
    e.preventDefault();

    if (staffFormData.password !== staffFormData.confirmPassword) {
      notifyError("Passwords do not match!");
      return;
    }

    try {
      const dataToSend = { ...staffFormData };
      delete dataToSend.confirmPassword;

      if (isEditing) {
        // Update Logic
        if (!dataToSend.password) delete dataToSend.password;
        await api.put(`/admin/users/${editId}`, dataToSend);
        notifySuccess("Staff Updated Successfully!");
      } else {
        // Create Logic
        await api.post("/admin/add-staff", dataToSend);
        notifySuccess("Staff Member Added Successfully!");
      }

      resetForm();
      setRefreshKey((oldKey) => oldKey + 1);
    } catch (err) {
      notifyError(err.response?.data?.msg || "Operation Failed");
    }
  };

  // --- EDIT FUNCTION ---
  const handleEditClick = (staffMember) => {
    setIsEditing(true);
    setEditId(staffMember._id);
    setStaffFormData({
      name: staffMember.name,
      username: staffMember.username,
      email: staffMember.email,
      password: "",
      confirmPassword: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- RESET FORM ---
  const resetForm = () => {
    setStaffFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // --- DELETE FUNCTIONS ---
  const executeDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      notifySuccess("User Deleted Successfully");
      setRefreshKey((oldKey) => oldKey + 1);
    } catch (err) {
      console.error(err);
      notifyError("Failed to delete user");
    }
  };

  const triggerDeleteConfirm = (id) => {
    notifyConfirm("Are you sure you want to delete this user?", () =>
      executeDeleteUser(id)
    );
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
      notifySuccess("Logged out successfully!");
    }, 100);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-2xl">
        <div className="p-8 text-2xl font-extrabold tracking-wider border-b border-blue-700 flex items-center gap-3">
          <span>👑</span> ADMIN PANEL
        </div>

        <nav className="flex-grow p-6 space-y-3 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">
            Overview
          </p>
          <SidebarBtn
            label="Dashboard"
            icon="📊"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />

          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mt-6 mb-2">
            User Management
          </p>
          <SidebarBtn
            label="Customers"
            icon="👥"
            isActive={activeTab === "customers"}
            onClick={() => setActiveTab("customers")}
          />
          <SidebarBtn
            label="Staff Team"
            icon="👔"
            isActive={activeTab === "staff"}
            onClick={() => setActiveTab("staff")}
          />

          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mt-6 mb-2">
            Hotel Management
          </p>
          <SidebarBtn
            label="Rooms"
            icon="🛏️"
            onClick={() => alert("Member 2 Work")}
          />
          <SidebarBtn
            label="Bookings"
            icon="📅"
            isActive={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          />
          <SidebarBtn
            label="Facilities"
            icon="🏊"
            onClick={() => alert("Member 5 Work")}
          />

          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mt-6 mb-2">
            Support
          </p>
          <SidebarBtn
            label="Inquiries"
            icon="📩"
            isActive={activeTab === "inquiries"}
            onClick={() => setActiveTab("inquiries")}
          />
          <SidebarBtn
            label="Reviews"
            icon="⭐"
            onClick={() => alert("Member 6 Work")}
          />
        </nav>

        <div className="p-6 border-t border-blue-700 bg-blue-900">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg shadow-lg transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">
            {activeTab === "dashboard" ? "Dashboard Overview" : activeTab}{" "}
            Management
          </h2>
          <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-900 font-medium">
            Admin: {user?.username}
          </div>
        </header>

        <div className="p-8">
          {/* VIEW 1: DASHBOARD STATS */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              <StatCard
                title="Total Customers"
                value={customerList.length || "0"}
                color="blue"
                icon="👥"
              />
              <StatCard
                title="Staff Members"
                value={staffList.length || "0"}
                color="purple"
                icon="👔"
              />
              <StatCard
                title="Active Bookings"
                value="24"
                color="green"
                icon="📅"
              />
              <StatCard
                title="Rooms Available"
                value="08"
                color="yellow"
                icon="🔑"
              />

              <div className="md:col-span-4 mt-8 p-10 bg-white rounded-2xl shadow-lg border border-gray-100 text-center">
                <h3 className="text-xl font-semibold text-gray-700">
                  Welcome to the Control Center
                </h3>
                <p className="text-gray-500 mt-2">
                  Select a module from the sidebar to manage.
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: CUSTOMERS LIST */}
          {activeTab === "customers" && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Registered Customers
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                    Total: {customerList.length}
                  </span>
                </div>
                <UserTable
                  users={customerList}
                  onDelete={triggerDeleteConfirm}
                />
              </div>
            </div>
          )}

          {/* VIEW 3: STAFF MANAGEMENT */}
          {activeTab === "staff" && (
            <div className="animate-fade-in">
              {/* Add/Edit Staff Form */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span
                    className={`p-2 rounded-lg ${
                      isEditing
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {isEditing ? "✏️" : "➕"}
                  </span>
                  {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
                </h3>

                <form
                  onSubmit={handleSubmitStaff}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={staffFormData.name}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={staffFormData.username}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={staffFormData.email}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EyeIconShowPassword
                      label={
                        isEditing
                          ? "New Password (Leave empty to keep current)"
                          : "Password"
                      }
                      name="password"
                      placeholder={isEditing ? "........" : "********"}
                      value={staffFormData.password}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          password: e.target.value,
                        })
                      }
                      required={!isEditing}
                    />

                    <EyeIconShowPassword
                      label="Confirm Password"
                      name="confirmPassword"
                      placeholder={isEditing ? "........" : "Re-enter password"}
                      value={staffFormData.confirmPassword}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all w-full md:w-auto ${
                        isEditing
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isEditing ? "Update Staff" : "Create Staff Account"}
                    </button>

                    {/* Cancel Edit Button */}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all w-full md:w-auto"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Staff Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Staff Team Members
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                    Total: {staffList.length}
                  </span>
                </div>
                <UserTable
                  users={staffList}
                  onDelete={triggerDeleteConfirm}
                  onEdit={handleEditClick}
                  isStaffView={true}
                />
              </div>
            </div>
          )}
          {/* VIEW 4: BOOKINGS MANAGEMENT */}
          {activeTab === "bookings" && (
            <div className="animate-fade-in">
              <AdminBooking />
            </div>
          )}
          {/* VIEW 5: INQUIRIES MANAGEMENT */}
          {activeTab === "inquiries" && (
            <div className="animate-fade-in">
              <AdminInquiry />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Reusable UI Components

const SidebarBtn = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1"
        : "text-blue-100 hover:bg-blue-800/50 hover:translate-x-1"
    }`}
  >
    <span className="text-xl">{icon}</span> {label}
  </button>
);

const StatCard = ({ title, value, color, icon }) => {
  const colors = {
    blue: "border-blue-500 text-blue-600",
    green: "border-green-500 text-green-600",
    yellow: "border-yellow-500 text-yellow-600",
    purple: "border-purple-500 text-purple-600",
  };
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-md border-b-4 ${colors[color]} hover:shadow-xl transition-shadow duration-300 flex items-center justify-between`}
    >
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
          {title}
        </h3>
        <p className="text-3xl font-extrabold text-gray-800">{value}</p>
      </div>
      <div className={`text-4xl opacity-20 ${colors[color].split(" ")[1]}`}>
        {icon}
      </div>
    </div>
  );
};

const UserTable = ({ users, onDelete, onEdit, isStaffView }) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
        <th className="p-5 font-semibold">Name</th>
        <th className="p-5 font-semibold">Username</th>
        <th className="p-5 font-semibold">Email</th>
        <th className="p-5 font-semibold">Role</th>
        <th className="p-5 font-semibold text-right">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {users.length > 0 ? (
        users.map((u) => (
          <tr
            key={u._id}
            className="hover:bg-blue-50/50 transition duration-150"
          >
            <td className="p-5 font-medium text-gray-800">{u.name}</td>
            <td className="p-5 text-gray-600">{u.username}</td>
            <td className="p-5 text-gray-600">{u.email}</td>
            <td className="p-5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  u.role === "staff"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {u.role.toUpperCase()}
              </span>
            </td>
            <td className="p-5 text-right flex justify-end gap-2">
              {isStaffView && (
                <button
                  onClick={() => onEdit(u)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded transition font-medium"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => onDelete(u._id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition font-medium"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="p-8 text-center text-gray-400">
            No {isStaffView ? "staff members" : "customers"} found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default AdminDashboard;
