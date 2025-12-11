/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user directly from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    return token && storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // --- LOGIN FUNCTION ---
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });

      // Save data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      return { success: true, user: res.data.user };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.msg);
      return {
        success: false,
        error: error.response?.data?.msg || "Login failed",
      };
    }
  };

  // --- NEW: REGISTER FUNCTION (Auto Login) ---
  const register = async (userData) => {
    try {
      // Send registration data to backend
      const res = await api.post("/auth/register", userData);

      // Backend returns token & user immediately, so we save them (Auto Login)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update State
      setUser(res.data.user);

      return { success: true, user: res.data.user };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.msg);
      return {
        success: false,
        error: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
