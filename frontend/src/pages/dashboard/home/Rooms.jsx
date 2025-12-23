import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../../config/api";
import { AuthContext } from "../../../context/AuthContext";
import { notifySuccess } from "../../../components/alert/ToastContext";
import Reviews from "./Reviews";

const Rooms = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATES ---
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [viewingReviewsFor, setViewingReviewsFor] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

  // --- GET SEARCH DATA ---
  const searchData = location.state?.searchData;
  const requestedRooms = searchData?.rooms || 1;
  const requestedAdults = searchData?.adults || 1;
  const requestedChildren = searchData?.children || 0;
  const totalGuests = requestedAdults + requestedChildren;

  // --- FETCH ROOMS ---
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // --- FETCH REVIEWS  ---
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await api.get("/reviews");
        setAllReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchAllReviews();
  }, []); // --- FETCH REVIEWS  ---
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await api.get("/reviews");
        setAllReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchAllReviews();
  }, []);

  // --- HELPER: GET REVIEW COUNT ---
  const getReviewCount = (roomId) => {
    return allReviews.filter((r) => r.room === roomId).length;
  };

  // --- SCROLL EFFECT ---
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

  const getStatusLabel = (room) => {
    if (room.status === "Booked") return "SOLD OUT";
    if (room.status === "Maintenance") return "MAINTENANCE";
    return "UNAVAILABLE";
  };

  const getStatusColor = (room) => {
    if (room.status === "Booked") return "border-red-500 bg-red-600/80";
    if (room.status === "Maintenance")
      return "border-orange-500 bg-orange-600/80";
    return "border-gray-500 bg-gray-600/80";
  };

  // --- FILTER ROOMS LOGIC ---
  const displayedRooms = searchData
    ? rooms.filter((room) => {
        const requiredCapacityPerRoom = Math.ceil(totalGuests / requestedRooms);
        return room.capacity >= requiredCapacityPerRoom;
      })
    : rooms;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* --- NAVBAR --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out border-b border-white/10 ${
          scrolled
            ? "bg-slate-900/95 shadow-2xl py-3"
            : "bg-black/30 backdrop-blur-sm py-4"
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

      {/* --- HERO SECTION --- */}
      <div
        className="relative h-[60vh] w-full flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <h2 className="text-amber-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">
            Luxury Accommodation
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            Stay in Comfort
          </h1>

          {/* --- BANNER LOGIC --- */}
          {searchData ? (
            <div className="text-lg text-amber-200 max-w-2xl mx-auto font-bold border border-amber-500/50 p-4 rounded-lg bg-black/40 backdrop-blur flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 p-2 rounded-full text-xl">
                  🔍
                </span>
                <div className="text-left">
                  <p className="text-xs text-amber-400 uppercase tracking-wider">
                    Results for
                  </p>
                  <p className="text-white">
                    {requestedRooms} Room{requestedRooms > 1 ? "s" : ""},{" "}
                    {requestedAdults} Adult{requestedAdults > 1 ? "s" : ""},{" "}
                    {requestedChildren} Child
                    {requestedChildren !== 1 ? "ren" : ""}
                  </p>
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-white/20"></div>
              <div className="text-left text-sm text-gray-300">
                {searchData.checkInDate}{" "}
                <span className="text-amber-500">➜</span>{" "}
                {searchData.checkOutDate}
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              Choose from our range of exquisite rooms and suites designed for
              your ultimate relaxation.
            </p>
          )}
        </div>
      </div>

      {/* --- ROOMS GRID --- */}
      <div className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">
              Loading Available Rooms...
            </div>
          ) : displayedRooms.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">😕</div>
              <h3 className="text-xl font-bold text-gray-700">
                No rooms match your specific criteria.
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your guest count or room count.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-amber-600 underline font-bold hover:text-amber-700"
              >
                Show all rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayedRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full group"
                >
                  {/* Image Area */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.image || "https://via.placeholder.com/400x300"}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 shadow-lg">
                      {room.type}
                    </div>

                    {!room.is_available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span
                          className={`text-white font-bold border-2 px-6 py-3 rounded-lg uppercase tracking-[0.2em] shadow-2xl transform rotate-[-5deg] ${getStatusColor(
                            room
                          )}`}
                        >
                          {getStatusLabel(room)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {room.name}
                      </h3>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {room.description ||
                        "Experience luxury and comfort in our beautifully designed rooms, equipped with modern amenities."}
                    </p>

                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-6 border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">
                            Starting from
                          </span>
                          <span className="text-2xl font-bold text-amber-600">
                            LKR {room.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-400">
                            {" "}
                            / night
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span>👥</span> {room.capacity} Guests
                        </div>
                      </div>

                     {/* Action Buttons Area */}
                      <div className="flex gap-4 mt-4">
                        <button
                          disabled={!room.is_available}
                          onClick={() => navigate(`/booking/${room._id}`)}
                          className={`flex-1 py-3 rounded-lg font-bold tracking-wider text-sm transition-all shadow-lg ${
                            room.is_available
                              ? "bg-slate-900 text-white hover:bg-amber-600 hover:shadow-amber-500/30"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          }`}
                        >
                          {room.is_available
                            ? "BOOK NOW"
                            : getStatusLabel(room)}
                        </button>

                        {/* REVIEWS BUTTON */}
                        <button
                          onClick={() => setViewingReviewsFor(room._id)}
                          className="px-5 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-bold text-sm hover:bg-amber-500 hover:text-white transition flex items-center gap-2 shadow-sm"
                        >
                          <span>💬</span> Reviews
                          {getReviewCount(room._id) > 0 && (
                            <span className="ml-1 bg-white text-amber-600 text-[10px] px-2 py-0.5 rounded-full border border-amber-200 shadow-sm">
                              {getReviewCount(room._id)}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* --- POPUP COMPONENT RENDER ---*/}
          {viewingReviewsFor && (
            <Reviews
              roomId={viewingReviewsFor}
              onClose={() => setViewingReviewsFor(null)}
            />
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

export default Rooms;
