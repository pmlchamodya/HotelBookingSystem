import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import {
  notifySuccess,
  notifyError,
} from "../../../components/alert/ToastContext";

const StaffBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch All Bookings ---
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      notifyError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- Handle Status Update ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      notifySuccess(`Booking marked as ${newStatus}`);
      fetchBookings();
    } catch (err) {
      console.error("Update failed:", err);
      notifyError("Failed to update status");
    }
  };

  // --- Status Colors Helper ---
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "checked_in":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "checked_out":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading bookings...</div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Manage Guest Bookings
        </h3>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
          Total: {bookings.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
              <th className="p-4">Guest Info</th>
              <th className="p-4">Room Type</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-800">
                      {booking.user ? booking.user.name : "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {booking.user ? booking.user.email : ""}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">
                    {booking.room ? (
                      booking.room.name
                    ) : (
                      <span className="text-red-400">Room Removed</span>
                    )}
                  </td>
                  <td className="p-4 text-xs">
                    <div className="text-gray-500">
                      In: {new Date(booking.checkInDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500">
                      Out: {new Date(booking.checkOutDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-amber-600">
                    ${booking.totalPrice}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        booking.status
                      )} uppercase`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* --- ACTION BUTTONS --- */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(booking._id, "confirmed")
                            }
                            className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(booking._id, "cancelled")
                            }
                            className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-200 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking._id, "checked_in")
                          }
                          className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-bold border border-blue-200 transition"
                        >
                          Check-In
                        </button>
                      )}

                      {booking.status === "checked_in" && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking._id, "checked_out")
                          }
                          className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs font-bold border border-gray-200 transition"
                        >
                          Check-Out
                        </button>
                      )}

                      {(booking.status === "checked_out" ||
                        booking.status === "cancelled") && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking._id, "pending")
                          }
                          className="text-amber-600 hover:bg-amber-50 px-2 py-1 rounded text-xs font-bold border border-amber-200 transition"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No bookings found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffBooking;
