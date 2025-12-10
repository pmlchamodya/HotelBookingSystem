import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Import Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

// Protected Route Component
// This prevents unauthorized users from accessing the dashboard
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // If not logged in, go to login
  if (!user) return <Navigate to="/login" />;

  // If role is specified (e.g., 'admin') and user doesn't match, redirect
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback for other users (You can create a UserDashboard later) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div style={{ padding: "20px" }}>
                  <h1>Customer Dashboard (Coming Soon)</h1>
                  <a href="/login">Logout</a>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
