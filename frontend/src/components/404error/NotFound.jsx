import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h1 className="text-9xl font-extrabold text-amber-600">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-amber-600 transition shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
