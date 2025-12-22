import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Import Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import StaffDashboard from "./pages/dashboard/staff/StaffDashboard";
import UserDashboard from "./pages/dashboard/user/UserDashboard";
import Home from "./pages/dashboard/home/Home";
import Contact from "./pages/dashboard/home/Contact";
import About from "./pages/dashboard/home/About";
import Rooms from "./pages/dashboard/home/Rooms";
import Booking from "./pages/dashboard/home/Booking";
import Facilities from "./pages/dashboard/home/Facilities";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // Check role permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Routes Logic
const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  // Determine redirect path based on role
  const getDashboardRoute = (role) => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "staff") return "/staff-dashboard";
    return "/";
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route
        path="/login"
        element={
          user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Staff Route */}
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Redirect */}
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
