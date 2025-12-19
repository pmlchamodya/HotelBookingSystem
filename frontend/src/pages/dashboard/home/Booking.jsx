import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../config/api";
import {
  notifySuccess,
  notifyError,
} from "../../../components/alert/ToastContext";

const Booking = () => {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- Component State ---
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Navbar States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // State for form inputs
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });

  // --- Scroll Effect for Navbar ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 1. Fetch Room Details ---
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
        notifyError("Failed to load room details.");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  // --- 2. Calculate Total Price ---
  const calculateTotal = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate || !room)
      return 0;
    const start = new Date(bookingData.checkInDate);
    const end = new Date(bookingData.checkOutDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * room.price : 0;
  };

  // --- 3. Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      notifyError("Please login to book a room.");
      navigate("/login");
      return;
    }

    // --- VALIDATION ---
    if (parseInt(bookingData.guests) > room.capacity) {
      notifyError(`Maximum guests allowed for this room is ${room.capacity}.`);
      return;
    }
    try {
      const totalPrice = calculateTotal();

      if (totalPrice <= 0) {
        notifyError(
          "Invalid dates selected. Check-out must be after Check-in."
        );
        return;
      }

      // Prepare data payload for the backend API
      const bookingPayload = {
        roomId: room._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        totalPrice: totalPrice,
      };

      // Send POST request to create booking
      await api.post("/bookings", bookingPayload);

      notifySuccess("Booking Request Sent Successfully!");
      navigate("/dashboard", { state: { activeTab: "bookings" } });
    } catch (err) {
      console.error(err);
      notifyError(
        err.response?.data?.error || "Booking Failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully!");
    setIsDropdownOpen(false);
    navigate("/");
  };

  // Get today's date for date picker validation (min date)
  const today = new Date().toISOString().split("T")[0];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading Room Details...
      </div>
    );
  if (!room) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* --- NAVBAR --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out border-b border-white/10 ${
          scrolled
            ? "bg-slate-900/95 shadow-2xl py-3"
            : "bg-black/50 backdrop-blur-md py-4"
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

        <div className="hidden md:flex gap-8 font-medium text-sm tracking-wider text-gray-200">
          <Link
            to="/"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Home
          </Link>
          <Link
            to="/rooms"
            className="text-amber-400 font-bold border-b-2 border-amber-400 pb-1"
          >
            Rooms
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Contact
          </Link>
        </div>

        <div>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold border transition-all duration-300 focus:outline-none ${
                  scrolled
                    ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-amber-400/50"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                } backdrop-blur-md`}
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

      {/* --- BOOKING CONTENT --- */}
      <div
        className="flex-grow flex items-center justify-center bg-fixed bg-cover bg-center font-sans p-6 pt-32 pb-20"
        style={{
          backgroundImage: `url(${
            room.image ||
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fade-in-up">
          {/* Left Side: Room Information */}
          <div className="p-8 md:p-12 text-white flex flex-col justify-center bg-gradient-to-br from-black/40 to-transparent">
            <button
              onClick={() => navigate("/rooms")}
              className="text-sm text-gray-300 hover:text-amber-400 mb-8 flex items-center gap-2 transition-colors w-fit"
            >
              ← Back to Rooms
            </button>

            <h2 className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-3">
              Confirm Your Stay
            </h2>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {room.name}
            </h1>
            <p className="text-gray-200 mb-8 leading-relaxed text-sm opacity-90">
              {room.description}
            </p>

            <div className="mt-auto space-y-4 bg-black/20 p-6 rounded-2xl border border-white/10">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400 text-sm uppercase tracking-wide">
                  Type
                </span>
                <span className="font-semibold">{room.type}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400 text-sm uppercase tracking-wide">
                  Price per Night
                </span>
                <span className="font-bold text-amber-400 text-lg">
                  LKR {room.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm uppercase tracking-wide">
                  Max Capacity
                </span>
                <span>{room.capacity} Guests</span>
              </div>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="p-8 md:p-12 bg-white text-gray-800 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-2">
              <span>📅</span> Reserve Dates
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection Inputs */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Check-In
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50 text-sm font-semibold"
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        checkInDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    required
                    min={bookingData.checkInDate || today}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50 text-sm font-semibold"
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        checkOutDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Guest Count Input */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max={room.capacity}
                  required
                  value={bookingData.guests}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50 text-sm font-semibold"
                  onChange={(e) =>
                    setBookingData({ ...bookingData, guests: e.target.value })
                  }
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  Max: {room.capacity} people
                </p>
              </div>

              {/* Total Price Display */}
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex justify-between items-center mt-6">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-xs text-amber-600/70">
                    Taxes & fees included
                  </span>
                </div>
                <span className="text-3xl font-bold text-amber-600">
                  LKR {calculateTotal().toLocaleString()}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-lg transform hover:-translate-y-1 text-sm tracking-widest uppercase"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-gray-400 pt-20 pb-10 border-t-4 border-amber-600 relative z-20">
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

export default Booking;
