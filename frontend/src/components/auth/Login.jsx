import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../alert/ToastContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.username, formData.password);

    if (result.success) {
      notifySuccess("Login Successful!");

      // --- REDIRECT LOGIC ---
      const role = result.user.role;

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/");
      }
    } else {
      notifyError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          System Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
