import React, { useState, useEffect, useContext } from "react";
import api from "../../../config/api";
import { AuthContext } from "../../../context/AuthContext";
import {
  notifySuccess,
  notifyError,
} from "../../../components/alert/ToastContext";

const Reviews = ({ roomId, onClose }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // --- FETCH REVIEWS ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${roomId}`);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (roomId) fetchReviews();
  }, [roomId]);

  // --- SUBMIT REVIEW ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      notifyError("Please login to write a review!");
      return;
    }

    try {
      const newReview = {
        room: roomId,
        user: user._id || user.id,
        username: user.username,
        rating,
        comment,
      };

      console.log("Submitting Review Data:", newReview);

      const res = await api.post("/reviews", newReview);

      // Update the reviews list with the new review
      setReviews([res.data, ...reviews]);

      // Reset form fields
      setComment("");
      setRating(5);
      notifySuccess("Review added successfully!");
    } catch (err) {
      console.error(err);
      notifyError("Failed to add review.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      {/* Modal Content */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>💬</span> Guest Reviews ({reviews.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Review Form */}
          {user ? (
            <form
              onSubmit={handleSubmit}
              className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200"
            >
              <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">
                Write a Review
              </h4>
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-300 outline-none focus:border-amber-500 bg-white text-sm"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                    <option value="4">⭐⭐⭐⭐ - Good</option>
                    <option value="3">⭐⭐⭐ - Average</option>
                    <option value="2">⭐⭐ - Poor</option>
                    <option value="1">⭐ - Terrible</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-amber-700 transition shadow-md"
                >
                  Post
                </button>
              </div>
              <textarea
                required
                rows="2"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-amber-500 text-sm"
              ></textarea>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 text-sm text-center">
              Please <span className="font-bold">Login</span> to share your
              experience.
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 py-4">
                Loading reviews...
              </p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <p className="text-4xl mb-2">💭</p>
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs">
                        {rev.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {rev.username}
                        </p>
                        <p className="text-[10px] text-amber-500 tracking-wide">
                          {"⭐".repeat(rev.rating)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm pl-11">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
