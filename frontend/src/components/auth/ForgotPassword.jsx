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
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* --- VIDEO BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={hotelVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10 flex-grow flex items-center justify-center p-6 py-20">
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

        {/* Forgot Password Card */}
        <div className="w-full max-w-md">
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

      {/* --- FOOTER --- */}
      <footer className="relative z-10 bg-slate-950 text-gray-400 pt-20 pb-10 border-t-4 border-amber-600">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <div className="flex flex-col mb-6">
              <span className="text-2xl font-serif font-bold text-white tracking-widest">
                KING
              </span>
              <span className="text-xs font-bold text-amber-600 tracking-[0.4em] uppercase">
                of Asia
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              A sanctuary of serenity in the heart of Colombo. Experience
              unmatched luxury and Sri Lankan hospitality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-amber-500 transition">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/dining" className="hover:text-amber-500 transition">
                  Dining & Bars
                </Link>
              </li>
              <li>
                <Link
                  to="/facilities"
                  className="hover:text-amber-500 transition"
                >
                  Spa & Wellness
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-500 transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <span className="text-amber-600">📍</span>
                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-amber-600">📞</span>
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-amber-600">✉️</span>
                <span>reservations@kingofasia.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">
              Newsletter
            </h3>
            <p className="text-xs mb-4">Subscribe for exclusive offers.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded focus:outline-none focus:border-amber-600 transition text-sm"
              />
              <button className="bg-amber-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-amber-700 transition">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-900 pt-8 text-center text-xs text-white-600">
          <p>© 2025 King of Asia Hotels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
