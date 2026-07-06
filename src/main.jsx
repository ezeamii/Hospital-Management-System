import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import DoctorsPage from "./pages/DoctorsPage.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";
import AppointmentPage from "./pages/AppointmentPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserDashboardPage from "./pages/UserDashboardPage.jsx";
import DoctorDashboardPage from "./pages/DoctorDashboardPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/locations" element={<LocationsPage />} />

      {/* 🔒 Protected route */}
      <Route
        path="/appointment"
        element={
          <ProtectedRoute>
            <AppointmentPage />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<UserDashboardPage />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
    </Routes>
  </Router>
);
