import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { notifySuccess } from "../../../components/alert/ToastContext";

const About = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            className="hover:text-amber-400 transition hover:scale-105 transform duration-200"
          >
            Rooms
          </Link>
          <Link
            to="/about"
            className="text-amber-400 font-bold border-b-2 border-amber-400 pb-1"
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

      {/* --- PARALLAX HERO SECTION --- */}
      <div
        className="relative h-[80vh] w-full flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920')",
        }}
      >
        {/* Gradient Overlay  */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900/90"></div>

        <div className="relative z-10 text-center text-white px-6 animate-fade-in-up max-w-4xl mx-auto">
          <div className="mb-6 inline-block p-3 border border-amber-500/30 rounded-full bg-black/20 backdrop-blur-md">
            <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm px-4">
              The King of Asia Experience
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-tight drop-shadow-2xl">
            A Legacy of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Pure Luxury
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Where Sri Lankan heritage meets modern elegance. Step into a world
            designed for the extraordinary.
          </p>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <span className="text-white/50 text-2xl">↓</span>
        </div>
      </div>

      {/* --- FLOATING CONTENT SECTION --- */}
      <div className="relative z-20 -mt-20 px-6 md:px-20 pb-24">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-[500px] md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
                alt="Hotel Interior"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply"></div>
            </div>

            {/* Text Side */}
            <div className="p-12 md:p-20 flex flex-col justify-center bg-white">
              <h3 className="text-amber-600 font-bold tracking-widest uppercase mb-4 text-xs">
                Since 2010
              </h3>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                Redefining Hospitality in{" "}
                <span className="text-amber-600">Colombo</span>
              </h2>
              <p className="text-gray-600 leading-loose mb-6 text-lg">
                Founded over a decade ago, <strong>King of Asia</strong> began
                with a simple vision: to create a sanctuary where luxury meets
                authentic Sri Lankan hospitality.
              </p>
              <p className="text-gray-600 leading-loose mb-10 text-lg">
                Every corner of our hotel tells a story of elegance, comfort,
                and attention to detail, designed to provide you with an
                unforgettable stay.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                  <span className="block text-4xl font-bold text-amber-500 mb-2">
                    15+
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Years of Service
                  </span>
                </div>
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                  <span className="block text-4xl font-bold text-amber-500 mb-2">
                    50k+
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Happy Guests
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- VISION PARALLAX SECTION --- */}
      <div
        className="relative py-32 px-6 md:px-20 bg-fixed bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center border border-white/20 bg-white/5 backdrop-blur-md p-12 md:p-20 rounded-3xl">
          <span className="text-6xl text-amber-500 block mb-8 font-serif">
            ❝
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-10 leading-tight">
            "To be the most preferred luxury hotel in South Asia, delivering
            exceptional experiences that linger in memories forever."
          </h2>
          <div className="inline-block border-t border-amber-500 pt-4">
            <p className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm">
              Our Vision
            </p>
          </div>
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

export default About;
