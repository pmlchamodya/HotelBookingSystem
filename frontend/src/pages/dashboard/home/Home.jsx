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
      {/* --- Navbar --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-3"
            : "bg-black/20 backdrop-blur-md py-4"
        } px-6 md:px-12 flex justify-between items-center`}
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span
            className={`text-2xl font-bold tracking-widest uppercase ${
              scrolled ? "text-blue-900" : "text-white"
            }`}
          >
            🏨 King of Asia
          </span>
        </div>

        <div
          className={`hidden md:flex gap-8 font-medium ${
            scrolled ? "text-gray-600" : "text-gray-200"
          }`}
        >
          <Link to="/" className="hover:text-amber-500 transition">
            Home
          </Link>
          <Link to="/rooms" className="hover:text-amber-500 transition">
            Rooms
          </Link>
          <Link to="/dining" className="hover:text-amber-500 transition">
            Booking
          </Link>
          <Link to="/facilities" className="hover:text-amber-500 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-amber-500 transition">
            Contact
          </Link>
        </div>

        <div>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold border transition focus:outline-none ${
                  scrolled
                    ? "bg-slate-100 text-slate-900 border-slate-200"
                    : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                }`}
              >
                {user.username} ▼
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50 overflow-hidden animate-fade-in">
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : user.role === "staff"
                        ? "/staff-dashboard"
                        : "/dashboard"
                    }
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-6 py-2 rounded-full font-medium transition shadow-lg ${
                scrolled
                  ? "bg-blue-900 text-white hover:bg-blue-800"
                  : "bg-white text-slate-900 hover:bg-gray-100"
              }`}
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
          poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920"
        >
          <source src={hotelVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hero Content (Explore Rooms Button Removed) */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
          <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] mb-4 uppercase animate-fade-in-up">
            Welcome to Paradise
          </h2>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 drop-shadow-2xl animate-fade-in-up delay-100">
            KING OF ASIA
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mb-10 text-gray-100 animate-fade-in-up delay-200">
            Experience world-class luxury, stunning ocean views, and the finest
            hospitality in the heart of Colombo.
          </p>
        </div>

        {/* Booking Bar  */}
        <div className="absolute bottom-10 left-0 w-full z-20 flex justify-center px-4 animate-fade-in-up delay-500">
          <div className="bg-white/90 backdrop-blur-md p-2 md:p-4 rounded-full shadow-2xl flex flex-col md:flex-row gap-2 md:gap-6 items-center border border-white/50">
            {/* CHECK IN */}
            <div className="px-4 border-b md:border-b-0 md:border-r border-gray-300 w-full md:w-auto">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Check In
              </label>
              <input
                type="date"
                defaultValue={today}
                min={today}
                className="bg-transparent outline-none text-gray-800 font-medium text-sm w-full cursor-pointer"
              />
            </div>

            {/* CHECK OUT */}
            <div className="px-4 border-b md:border-b-0 md:border-r border-gray-300 w-full md:w-auto">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Check Out
              </label>
              <input
                type="date"
                defaultValue={tomorrow}
                min={tomorrow}
                className="bg-transparent outline-none text-gray-800 font-medium text-sm w-full cursor-pointer"
              />
            </div>

            <div className="px-4 border-b md:border-b-0 md:border-r border-gray-300 w-full md:w-auto min-w-[150px]">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Guests
              </label>
              <select className="bg-transparent outline-none text-gray-800 font-medium text-sm w-full cursor-pointer">
                <option>2 Adults</option>
                <option>1 Adult</option>
                <option>Family (2A, 2C)</option>
              </select>
            </div>
            <button className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg w-full md:w-auto transform hover:scale-105">
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-20 px-6 md:px-20 bg-gray-50 text-center">
        <h3 className="text-amber-600 font-bold tracking-widest uppercase mb-3">
          Our Philosophy
        </h3>
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-6">
          Redefining Luxury Hospitality
        </h2>
        <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-lg">
          Nestled along the pristine coastline, King of Asia offers an escape
          into a world of refined elegance.
        </p>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <div className="text-2xl font-bold text-white mb-6 tracking-widest uppercase">
              🏨 King of Asia
            </div>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              A sanctuary of serenity in the heart of Colombo. Experience
              unmatched luxury and Sri Lankan hospitality.
            </p>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-600 transition cursor-pointer">
                FB
              </span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-600 transition cursor-pointer">
                IG
              </span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-600 transition cursor-pointer">
                TW
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6">
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
              <li>
                <Link to="/offers" className="hover:text-amber-500 transition">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span>📍</span>
                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex gap-3">
                <span>📞</span>
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex gap-3">
                <span>✉️</span>
                <span>reservations@kingofasia.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to receive the latest news and exclusive offers.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded focus:outline-none focus:border-amber-500 transition"
              />
              <button className="bg-amber-600 text-white px-4 py-2 rounded font-bold hover:bg-amber-700 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-xs text-gray-500">
          <p>
            © 2025 King of Asia Hotels. All rights reserved. | Privacy Policy |
            Terms of Use
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
