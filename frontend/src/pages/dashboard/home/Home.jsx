import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { notifySuccess } from "../../../components/alert/ToastContext";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle Logout Logic
  const handleLogout = () => {
    logout();
    notifySuccess("Logged out successfully!");
    setIsDropdownOpen(false); // Close menu
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* --- Navbar --- */}
      <nav className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center z-50">
        {/* Logo Section */}
        <div
          className="text-2xl font-bold text-blue-900 flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          🏨 <span className="ml-2 tracking-wide">KING OF ASIA</span>
        </div>

        {/* Right Side Section */}
        <div>
          {user ? (
            <div className="relative">
              {/* User Name Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-2 rounded-full font-semibold border border-blue-200 hover:bg-blue-100 transition focus:outline-none"
              >
                {/* User Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>

                {/* Display Username */}
                {user.username}

                {/* Arrow Icon SVG (Rotates if open) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Dropdown Menu (Shows only if isDropdownOpen is true) */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50 overflow-hidden animation-fade-in">
                  {/* Dashboard Link */}
                  <Link
                    to={
                      user.role === "admin" ? "/admin-dashboard" : "/dashboard"
                    }
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span>📊</span> Dashboard
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition font-medium shadow-lg"
            >
              Login / Register
            </Link>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <div
        className="flex-grow bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop")',
          minHeight: "85vh",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            FIND YOUR NEXT STAY
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light drop-shadow-lg text-gray-100">
            Experience world-class luxury and comfort at the best prices.
          </p>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-white py-8 text-center border-t border-slate-800">
        <p className="text-gray-400">
          © 2025 King of Asia Hotels. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
