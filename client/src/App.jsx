import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TempleListPage from "./pages/TempleListPage";
import TempleDetailsPage from "./pages/TempleDetailsPage";
import BookingPage from "./pages/BookingPage";
// FIXED IMPORT: Swap the old page with our new premium style page file components target
import MyBookingsPage from "./pages/MyBookingsPage"; 
import ProfilePage from "./pages/ProfilePage";

// Dashboards
import UserDashboard from "./dashboards/UserDashboard";
import OrganizerDashboard from "./dashboards/OrganizerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Temple Routes */}
        <Route path="/temples" element={<TempleListPage />} />
        <Route path="/temples/:id" element={<TempleDetailsPage />} />

        {/* Booking Checkout Route */}
        <Route
          path="/booking/:slotId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* FIXED HISTORY ROUTE: Loading the premium horizontal ticket card view layout */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Organizer Dashboard */}
        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute role="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;