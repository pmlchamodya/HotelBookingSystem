import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// --- IMPORTS ---
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
// Import the Home page correctly
import Home from "./pages/dashboard/home/Home";

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Role-based access control
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- MAIN ROUTES COMPONENT ---
const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="p-10">
              <h1>User Dashboard</h1>
              <a href="/" className="text-blue-500">
                Go Home
              </a>
            </div>
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirect any unknown routes to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </AuthProvider>
  );
};

export default App;
