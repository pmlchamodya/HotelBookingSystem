import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  notifySuccess,
  notifyError,
  notifyConfirm,
} from "../../../components/alert/ToastContext";

const StaffReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = (id) => {
    notifyConfirm("Delete this review?", async () => {
      try {
        await api.delete(`/reviews/${id}`);
        setReviews(reviews.filter((r) => r._id !== id));
        notifySuccess("Review deleted!");
      } catch (err) {
        console.error(err);
        notifyError("Failed to delete.");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>⭐</span> Customer Reviews (Staff View)
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
            <th className="p-4">User</th>
            <th className="p-4">Rating</th>
            <th className="p-4">Comment</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-50 hover:bg-gray-50"
            >
              <td className="p-4 font-bold text-gray-700">{item.username}</td>
              <td className="p-4 text-amber-500">{"⭐".repeat(item.rating)}</td>
              <td className="p-4 text-gray-600 truncate max-w-xs">
                {item.comment}
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:bg-red-50 px-3 py-1 rounded font-bold text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffReviews;
