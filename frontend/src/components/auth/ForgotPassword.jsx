import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../alert/ToastContext";
import hotelVideo from "../../assets/video/hotel-video.mp4";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // --- Handle Form Submission ---
  const onSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      notifyError("Please enter your email address.");
      return;
    }

    notifySuccess("Password reset link sent to your email!");

    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center font-sans">
      {/* --- VIDEO BACKGROUND --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* --- BACK TO LOGIN BUTTON --- */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 z-20 text-white/80 hover:text-amber-400 transition flex items-center gap-2 font-medium text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Login
      </button>

      {/* --- FORGOT PASSWORD CARD --- */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        {/* Header Text */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-serif font-bold text-white tracking-wider drop-shadow-lg">
            FORGOT PASSWORD?
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Don't worry, we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2 ml-1">
                Enter your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder-gray-400"
                placeholder="mail@example.com"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg mt-2"
            >
              Send Reset Link
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
