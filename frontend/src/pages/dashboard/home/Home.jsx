import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { notifySuccess } from "../../../components/alert/ToastContext";
import hotelVideo from "../../../assets/video/hotel-video.mp4";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- DATE LOGIC ---
  const today = new Date().toISOString().split("T")[0];
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const tomorrow = nextDay.toISOString().split("T")[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully!");
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
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
          {/* Logo */}
          <span className="text-2xl font-bold tracking-widest uppercase text-white group-hover:text-amber-400 transition-colors duration-300">
            🏨 King of Asia
          </span>
        </div>

        {/* Center Links */}
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
              {/* User Button */}
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

              {/* --- DROPDOWN MENU --- */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-white/10 z-50 overflow-hidden animate-fade-in origin-top-right">
                  {/* User Info Header */}
                  <div className="px-5 py-3 border-b border-white/10">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-amber-400 truncate">
                      {user.username}
                    </p>
                  </div>

                  {/* Dashboard Link */}
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : user.role === "staff"
                        ? "/staff-dashboard"
                        : "/dashboard"
                    }
                    className="px-5 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-amber-400 transition flex items-center gap-3"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span>📊</span> Dashboard
                  </Link>

                  {/* My Bookings Link */}
                  {user.role === "customer" && (
                    <Link
                      to="/dashboard"
                      className="px-5 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-amber-400 transition flex items-center gap-3"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>📅</span> My Bookings
                    </Link>
                  )}

                  <div className="border-t border-white/10 my-1"></div>

                  {/* Logout Button */}
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
            // Login Button
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-medium text-sm tracking-wide transition-all shadow-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-amber-400 hover:text-amber-400 backdrop-blur-md"
            >
              Login / Register
            </Link>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          // poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920"
        >
          <source src={hotelVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
          <h2 className="text-sm md:text-lg font-medium tracking-[0.4em] mb-4 uppercase animate-fade-in-up text-amber-300">
            Welcome to Paradise
          </h2>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 drop-shadow-2xl animate-fade-in-up delay-100">
            KING OF ASIA
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mb-10 text-gray-100 animate-fade-in-up delay-200 leading-relaxed">
            Experience world-class luxury, stunning ocean views, and the finest
            hospitality in the heart of Colombo.
          </p>
        </div>

        {/* Booking Bar */}
        <div className="absolute bottom-10 left-0 w-full z-20 flex justify-center px-4 animate-fade-in-up delay-500">
          <div className="bg-white/95 backdrop-blur-xl p-3 md:p-5 rounded-full shadow-2xl flex flex-col md:flex-row gap-4 items-center border border-white/50">
            {/* CHECK IN */}
            <div className="px-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto">
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                Check In
              </label>
              <input
                type="date"
                defaultValue={today}
                min={today}
                className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full cursor-pointer"
              />
            </div>

            {/* CHECK OUT */}
            <div className="px-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto">
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                Check Out
              </label>
              <input
                type="date"
                defaultValue={tomorrow}
                min={tomorrow}
                className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full cursor-pointer"
              />
            </div>

            <div className="px-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto min-w-[150px]">
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                Guests
              </label>
              <select className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full cursor-pointer">
                <option>2 Adults</option>
                <option>1 Adult</option>
                <option>Family (2A, 2C)</option>
              </select>
            </div>
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-amber-600 transition-colors shadow-lg w-full md:w-auto">
              CHECK AVAILABILITY
            </button>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-24 px-6 md:px-20 bg-gray-50 text-center">
        <h3 className="text-amber-600 font-bold tracking-widest uppercase mb-4 text-xs">
          Our Philosophy
        </h3>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
          Redefining Luxury Hospitality
        </h2>
        <p className="text-gray-600 max-w-4xl mx-auto leading-loose text-lg font-light">
          Nestled along the pristine coastline,{" "}
          <span className="font-semibold text-slate-800">King of Asia</span>{" "}
          offers an escape into a world of refined elegance.
        </p>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-gray-400 pt-20 pb-10 border-t-4 border-amber-600">
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

export default Home;
