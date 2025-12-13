import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";

const UserMyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch User Bookings ---
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my-bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // --- Helper for Status Colors ---
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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <p className="text-gray-500">Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fade-in">
      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-6xl mb-4 opacity-20">📅</div>
          <h3 className="text-xl font-bold text-gray-700">No Bookings Found</h3>
          <p className="text-gray-500 mb-6">
            You haven't made any reservations yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-600 transition"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                <th className="p-4">Room Type</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-bold text-slate-800">
                    {booking.room ? booking.room.name : "Room Removed"}
                  </td>
                  <td className="p-4">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserMyBookings;
