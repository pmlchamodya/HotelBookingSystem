import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { AuthContext } from "../../../context/AuthContext";
import { notifySuccess } from "../../../components/alert/ToastContext";

const Facilities = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATES ---
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- FETCH FACILITIES ---
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await api.get("/facilities");
        setFacilities(res.data);
      } catch (err) {
        console.error("Failed to fetch facilities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // --- FILTER ACTIVE FACILITIES ---
  const activeFacilities = facilities.filter((f) => f.isActive !== false);

  // --- SCROLL EFFECT FOR NAVBAR ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully!");
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
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
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Rooms
          </Link>
          <Link
            to="/facilities"
            className="text-amber-400 font-bold border-b-2 border-amber-400 pb-1"
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
                    onClick={() => setIsDropdownOpen(false)}
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

      {/* --- HERO SECTION (Height Increased to 75vh) --- */}
      <div
        // CHANGED: h-[50vh] -> h-[75vh] (Updated height)
        className="relative h-[75vh] w-full flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <h2 className="text-amber-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">
            Experience Comfort
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            Our Facilities
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the premium amenities designed to make your stay
            unforgettable.
          </p>
        </div>
      </div>

      {/* --- FACILITIES GRID --- */}
      <div className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">
              Loading Facilities...
            </div>
          ) : activeFacilities.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-700">
                No facilities available at the moment.
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {activeFacilities.map((facility) => (
                <div
                  key={facility._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full group"
                >
                  {/* Image Area */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        facility.image || "https://via.placeholder.com/400x300"
                      }
                      alt={facility.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Showing TIMINGS */}
                    {facility.timings && (
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                        <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm backdrop-blur-md bg-black/30 px-3 py-1 rounded-full">
                          <span>⏰</span> {facility.timings}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {facility.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-gray-400 pt-20 pb-10 border-t-4 border-amber-600">
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

export default Facilities;
