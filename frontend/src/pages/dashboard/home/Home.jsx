import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* --- Navbar --- */}
      <nav className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center z-50">
        <div className="text-2xl font-bold text-blue-900 flex items-center">
          🏨 <span className="ml-2 tracking-wide">KING OF ASIA</span>
        </div>
        <div>
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium shadow-lg"
            >
              Dashboard ({user.username})
            </Link>
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            FIND YOUR NEXT STAY
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light drop-shadow-lg text-gray-100">
            Experience world-class luxury and comfort at the best prices.
          </p>

          {/* Search Box UI */}
          <div className="bg-white p-3 rounded-xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Where do you want to stay?"
              className="flex-grow p-4 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="p-4 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="p-4 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition shadow-md uppercase tracking-wider">
              Search
            </button>
          </div>
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
