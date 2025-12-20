import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  notifySuccess,
  notifyError,
} from "../../../components/alert/ToastContext";

const StaffRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    type: "Single",
    price: "",
    capacity: "",
    description: "",
    image: "",
    status: "Available",
  });

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      notifyError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
    }
  };

  const openModal = (room = null) => {
    if (room) {
      setIsEditing(true);
      setEditId(room._id);
      setFormData({
        ...room,
        status: room.status || (room.is_available ? "Available" : "Booked"),
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        type: "Single",
        price: "",
        capacity: "",
        description: "",
        image: "",
        status: "Available",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Status Logic for Staff too
    const payload = {
      ...formData,
      is_available: formData.status === "Available",
    };

    try {
      if (isEditing) {
        await api.put(`/rooms/${editId}`, payload);
        notifySuccess("Room updated successfully!");
      } else {
        await api.post("/rooms", payload);
        notifySuccess("Room added successfully!");
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      console.error(err);
      notifyError("Operation failed. Please check your data.");
    }
  };

  // Helper for Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700 border-green-200";
      case "Maintenance":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Booked":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Rooms...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>🏨</span> Room Management (Staff)
        </h3>
        <button
          onClick={() => openModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-700 transition flex items-center gap-2"
        >
          + Add New Room
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <th className="p-4">Image</th>
              <th className="p-4">Room Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Price (LKR)</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {rooms.map((room) => (
              <tr key={room._id} className="hover:bg-amber-50/30 transition">
                <td className="p-4">
                  <img
                    src={room.image || "https://via.placeholder.com/150"}
                    alt={room.name}
                    className="w-16 h-12 object-cover rounded-md shadow-sm border border-gray-200"
                  />
                </td>
                <td className="p-4 font-bold text-gray-800">{room.name}</td>
                <td className="p-4 text-gray-600">{room.type}</td>
                <td className="p-4 font-mono font-medium text-amber-600">
                  {room.price.toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      room.status ||
                        (room.is_available ? "Available" : "Booked")
                    )}`}
                  >
                    {room.status ||
                      (room.is_available ? "Available" : "Booked")}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => openModal(room)}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-xs font-bold transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Edit Room" : "Add New Room"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Room Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                    <option value="Villa">Villa</option>
                    <option value="Cabana">Cabana</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    required
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Current Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 outline-none font-bold ${
                    formData.status === "Available"
                      ? "text-green-600 bg-green-50 border-green-200"
                      : formData.status === "Maintenance"
                      ? "text-orange-600 bg-orange-50 border-orange-200"
                      : "text-red-600 bg-red-50 border-red-200"
                  }`}
                >
                  <option value="Available">🟢 Available</option>
                  <option value="Maintenance">🟠 Maintenance</option>
                  <option value="Booked">🔴 Booked / Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Room Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg outline-none mb-2"
                />
                <div className="text-center text-xs text-gray-400 mb-2">
                  - OR -
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-md"
                >
                  {isEditing ? "Update Room" : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRooms;
