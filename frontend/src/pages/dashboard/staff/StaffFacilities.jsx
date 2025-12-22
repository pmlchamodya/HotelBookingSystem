import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  notifySuccess,
  notifyError,
  notifyConfirm,
} from "../../../components/alert/ToastContext";

const StaffFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- FORM DATA STATE ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    timings: "",
    isActive: true,
  });

  // --- FETCH FACILITIES ---
  const fetchFacilities = async () => {
    try {
      const res = await api.get("/facilities");
      setFacilities(res.data);
    } catch (err) {
      console.error("Failed to fetch facilities", err);
      notifyError("Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- HANDLE CHECKBOX CHANGE ---
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // --- HANDLE IMAGE UPLOAD ---
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

  // --- OPEN MODAL ---
  const openModal = (facility = null) => {
    if (facility) {
      setIsEditing(true);
      setEditId(facility._id);
      setFormData({
        name: facility.name,
        description: facility.description,
        image: facility.image,
        timings: facility.timings || "",
        isActive: facility.isActive !== undefined ? facility.isActive : true,
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        description: "",
        image: "",
        timings: "24/7",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/facilities/${editId}`, formData);
        notifySuccess("Facility updated successfully!");
      } else {
        await api.post("/facilities", formData);
        notifySuccess("Facility added successfully!");
      }
      setShowModal(false);
      fetchFacilities();
    } catch (err) {
      console.error(err);
      notifyError("Operation failed. Please check inputs.");
    }
  };

  // --- DELETE FACILITY ---
  const handleDelete = (id) => {
    notifyConfirm(
      "Are you sure you want to delete this facility?",
      async () => {
        try {
          await api.delete(`/facilities/${id}`);
          notifySuccess("Facility deleted successfully!");
          setFacilities(facilities.filter((f) => f._id !== id));
        } catch (err) {
          console.error(err);
          notifyError("Failed to delete facility.");
        }
      }
    );
  };

  if (loading)
    return <div className="p-10 text-center">Loading Facilities...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>🏊</span> Facility Management (Staff)
        </h3>
        <button
          onClick={() => openModal()}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-700 transition flex items-center gap-2"
        >
          + Add Facility
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <th className="p-4">Image</th>
              <th className="p-4">Info</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {facilities.map((item) => (
              <tr key={item._id} className="hover:bg-amber-50/30 transition">
                <td className="p-4">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-200"
                  />
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-800 text-base">
                    {item.name}
                  </div>
                  {/* Display timings here */}
                  <div className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
                    <span>⏰</span> {item.timings || "24/7"}
                  </div>
                  <div className="text-gray-500 text-xs truncate max-w-xs mt-1">
                    {item.description}
                  </div>
                </td>
                <td className="p-4">
                  {item.isActive ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-xs font-bold transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-bold transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Edit Facility" : "Add New Facility"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Swimming Pool"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Timings Input  */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Timings / Opening Hours{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    ⏰
                  </span>
                  <input
                    type="text"
                    name="timings"
                    value={formData.timings}
                    onChange={handleChange}
                    placeholder="e.g. 6:00 AM - 10:00 PM or 24/7"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                >
                  Mark as Active / Available to guests
                </label>
              </div>

              {/* Image Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Facility Image
                </label>

                {/* Image Preview */}
                {formData.image && (
                  <div className="mb-3 relative group w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">Preview</span>
                    </div>
                  </div>
                )}

                {/* URL Input */}
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Or paste image URL here..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />

                <div className="text-center text-xs text-gray-400 mb-2">
                  - OR -
                </div>

                {/* File Upload Box */}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-6 h-6 mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500">
                      Click to upload image file
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the facility amenities..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg hover:shadow-xl transition flex items-center gap-2"
                >
                  {isEditing ? "Update Facility" : "Save Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffFacilities;
