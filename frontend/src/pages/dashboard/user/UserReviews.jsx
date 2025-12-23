import React, { useEffect, useState, useContext } from "react";
import api from "../../../config/api";
import { AuthContext } from "../../../context/AuthContext";
import {
  notifySuccess,
  notifyError,
  notifyConfirm,
} from "../../../components/alert/ToastContext";

const UserReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  // --- EDIT STATE ---
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // --- FETCH REVIEWS ---
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await api.get("/reviews");
        // Filter reviews to show only current user's reviews
        const myReviews = res.data.filter(
          (r) => r.user === user._id || r.username === user.username
        );
        setReviews(myReviews);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchMyReviews();
  }, [user]);

  // --- DELETE FUNCTION ---
  const handleDelete = (id) => {
    notifyConfirm("Are you sure you want to delete this review?", async () => {
      try {
        await api.delete(`/reviews/${id}`);
        setReviews(reviews.filter((r) => r._id !== id));
        notifySuccess("Review deleted successfully!");
      } catch (err) {
        console.error(err);
        notifyError("Failed to delete review.");
      }
    });
  };

  // --- START EDITING ---
  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // --- CANCEL EDITING ---
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  // --- SAVE EDIT ---
  const handleUpdate = async (id) => {
    try {
      const updatedData = {
        rating: editRating,
        comment: editComment,
      };

      const res = await api.put(`/reviews/${id}`, updatedData);

      setReviews(reviews.map((r) => (r._id === id ? res.data : r)));

      notifySuccess("Review updated successfully!");
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      notifyError("Failed to update review.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">⭐ My Reviews</h3>
      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">You haven't posted any reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-start transition-all"
            >
              {editingReviewId === rev._id ? (
                // --- EDIT MODE ---
                <div className="w-full">
                  <div className="mb-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Rating
                    </label>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="w-full p-2 mt-1 rounded border border-gray-300 text-sm"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                      <option value="4">⭐⭐⭐⭐ - Good</option>
                      <option value="3">⭐⭐⭐ - Average</option>
                      <option value="2">⭐⭐ - Poor</option>
                      <option value="1">⭐ - Terrible</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Comment
                    </label>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full p-2 mt-1 rounded border border-gray-300 text-sm"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(rev._id)}
                      className="px-3 py-1 text-xs font-bold text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // --- VIEW MODE ---
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-500 text-sm">
                        {"⭐".repeat(rev.rating)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{rev.comment}</p>
                  </div>

                  <div className="flex gap-2">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => handleStartEdit(rev)}
                      className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                      title="Edit Review"
                    >
                      ✏️
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete Review"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserReviews;
