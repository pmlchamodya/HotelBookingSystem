import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { AuthContext } from "../../../context/AuthContext";
import {
  notifySuccess,
  notifyError,
} from "../../../components/alert/ToastContext";

const Contact = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATES ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGOUT ---
  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully!");
    setIsDropdownOpen(false);
    navigate("/");
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/inquiries", formData);
      notifySuccess("Message sent successfully! We will contact you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err) {
      console.error(err);
      notifyError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative text-gray-800">
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out border-b border-white/10 ${
          scrolled
            ? "bg-slate-900/90 shadow-2xl py-3 backdrop-blur-md"
            : "bg-transparent py-4"
        } px-6 md:px-12 flex justify-between items-center`}
      >
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-bold tracking-widest uppercase text-white group-hover:text-amber-400 transition-colors duration-300">
            🏨 King of Asia
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 font-medium text-sm tracking-wider text-gray-200">
          <Link
            to="/"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Home
          </Link>
          <Link
            to="/rooms"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Rooms
          </Link>
          <Link
            to="/facilities"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Facilities
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-amber-400 font-bold border-b-2 border-amber-400 pb-1"
          >
            Contact
          </Link>
        </div>

        {/* User / Login Button */}
        <div>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all duration-300"
              >
                <span className="text-sm">{user.username}</span>
                <span
                  className={`text-xs transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-white/10 z-50 overflow-hidden animate-fade-in origin-top-right">
                  <div className="px-5 py-3 border-b border-white/10">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-amber-400 truncate">
                      {user.username}
                    </p>
                  </div>
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : user.role === "staff"
                        ? "/staff-dashboard"
                        : "/dashboard"
                    }
                    className="px-5 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-amber-400 transition flex items-center gap-3"
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition flex items-center gap-3"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-medium text-sm tracking-wide transition-all shadow-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-amber-400 hover:text-amber-400 backdrop-blur-md"
            >
              Login / Register
            </Link>
          )}
        </div>
      </nav>

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-32 pb-20 px-6">
        {/* HERO TEXT */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
            We are here for you
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-2xl text-white">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Have questions or need assistance? Our dedicated team is ready to
            provide you with the best service.
          </p>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fade-in-up delay-100">
          {/* Left Side: Info */}
          <div className="p-12 flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <h2 className="text-amber-500 font-bold tracking-widest uppercase mb-4 text-sm z-10">
              Get in Touch
            </h2>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 z-10">
              Let's Chat
            </h1>
            <p className="text-gray-400 mb-10 leading-relaxed z-10">
              Whether you're planning a stay, an event, or just have a query,
              reach out to us. We'd love to hear from you.
            </p>

            <div className="space-y-8 z-10">
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-slate-900 transition duration-300">
                  📍
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Visit Us
                  </p>
                  <p className="font-medium text-lg leading-snug text-gray-100">
                    123 Galle Road, <br /> Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-slate-900 transition duration-300">
                  📞
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Call Us
                  </p>
                  <p className="font-medium text-lg text-gray-100">
                    +94 11 234 5678
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-slate-900 transition duration-300">
                  ✉️
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Email Us
                  </p>
                  <p className="font-medium text-lg text-gray-100">
                    reservations@kingofasia.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form  */}
          <div className="p-12 bg-white/60">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                  placeholder="Name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Subject
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-gray-900 appearance-none cursor-pointer transition-all shadow-sm"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  >
                    <option value="General Inquiry">Select a Subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Booking Issue">
                      Booking / Reservation Issue
                    </option>
                    <option value="Event Planning">
                      Event / Wedding Planning
                    </option>
                    <option value="Feedback">Feedback & Suggestions</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white text-gray-900 placeholder-gray-400 transition-all resize-none shadow-sm"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 transform hover:-translate-y-1"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- FOOTER  --- */}
      <footer className="relative z-10 bg-slate-950 text-gray-400 pt-20 pb-10 border-t-4 border-amber-600">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
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
                <Link to="/about" className="hover:text-amber-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <span className="text-amber-600">📍</span>
                <span>123 Galle Road, Colombo 03</span>
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
        <div className="border-t border-slate-900 pt-8 text-center text-xs text-white-600">
          <p>© 2025 King of Asia Hotels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
