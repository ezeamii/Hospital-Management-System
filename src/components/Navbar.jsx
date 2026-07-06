import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogoClick = (e) => {
    // === DOCTOR: disable logo entirely ===
    if (user?.role === "doctor") {
      e.preventDefault();
      return;
    }

    // === normal behavior ===
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 200);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">

        {/* === Brand Logo === */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="navbar-brand d-flex align-items-center"
          style={user?.role === "doctor" ? { cursor: "default" } : {}}
        >
          <img
            src="/images/logo.png"
            alt="Hospital Logo"
            className="me-2 rounded-circle"
            width="50"
            height="50"
          />
          <span className="fw-bold text-primary">ZamCare Hospital</span>
        </a>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* ================================
                DOCTOR NAVBAR (ONLY DASHBOARD)
            ================================= */}
            {user?.role === "doctor" ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/doctor-dashboard"
                    className="nav-link text-success fw-bold"
                  >
                    Doctor Dashboard
                  </Link>
                </li>

                <li className="nav-item d-flex align-items-center ms-3 me-3">
                  <span className="text-primary small fw-semibold">
                    👤 {user.name} (doctor)
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* ================================
                    NORMAL NAVBAR (guest + patient)
                ================================= */}
                {location.pathname === "/" ? (
                  <>
                    <li className="nav-item">
                      <ScrollLink
                        to="home"
                        smooth
                        duration={500}
                        offset={-70}
                        className="nav-link"
                      >
                        Home
                      </ScrollLink>
                    </li>
                    <li className="nav-item">
                      <ScrollLink
                        to="services"
                        smooth
                        duration={500}
                        offset={-70}
                        className="nav-link"
                      >
                        Services
                      </ScrollLink>
                    </li>
                    <li className="nav-item">
                      <ScrollLink
                        to="appointments"
                        smooth
                        duration={500}
                        offset={-70}
                        className="nav-link"
                      >
                        Appointments
                      </ScrollLink>
                    </li>
                    <li className="nav-item">
                      <ScrollLink
                        to="contact"
                        smooth
                        duration={500}
                        offset={-70}
                        className="nav-link"
                      >
                        Contact
                      </ScrollLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/doctors" className="nav-link">
                        Find a Doctor
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/locations" className="nav-link">
                        Locations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/appointment" className="nav-link">
                        Appointments
                      </Link>
                    </li>
                  </>
                )}

                {/* === LOGGED-IN PATIENT / GUEST === */}
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/dashboard"
                        className="nav-link text-success fw-semibold"
                      >
                        My Dashboard
                      </Link>
                    </li>
                    <li className="nav-item d-flex align-items-center ms-2 me-3">
                      <span className="text-primary small fw-semibold">
                        👤 {user.name} ({user.role})
                      </span>
                    </li>
                    <li className="nav-item">
                      <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/login"
                        className="nav-link fw-semibold text-primary"
                      >
                        Login
                      </Link>
                    </li>
                    <li className="nav-item ms-2">
                      <Link
                        to="/register"
                        className="btn btn-primary btn-sm px-3 fw-semibold"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
