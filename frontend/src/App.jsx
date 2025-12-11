import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import StaffDashboard from "./pages/dashboard/staff/StaffDashboard";
import Home from "./pages/dashboard/home/Home";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // Role Check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  // Helper function to decide where to redirect logged-in users
  const getDashboardRoute = (role) => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "staff") return "/staff-dashboard";
    return "/";
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />
        }
      />

      <Route path="/register" element={<Register />} />

      {/* ADMIN ROUTE */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* STAFF ROUTE (NEW) */}
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* CUSTOMER/DEFAULT DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <div className="p-10">
              <h1>User Dashboard</h1>
              <a href="/" className="text-blue-500">
                Go Home
              </a>
            </div>
          </ProtectedRoute>
        }
      />

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
