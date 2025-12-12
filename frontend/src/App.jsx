import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// --- IMPORT COMPONENTS ---
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import StaffDashboard from "./pages/dashboard/staff/StaffDashboard";
import UserDashboard from "./pages/dashboard/user/UserDashboard";
import Home from "./pages/dashboard/home/Home";

// --- PROTECTED ROUTE COMPONENT ---
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

// --- APP ROUTES ---
const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const getDashboardRoute = (role) => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "staff") return "/staff-dashboard";
    return "/dashboard";
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

      {/* --- ADMIN ROUTE --- */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* --- STAFF ROUTE --- */}
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* --- CUSTOMER ROUTE  --- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all - Redirect to Home */}
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
