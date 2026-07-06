import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const doctors = [
    { name: "Dr. Mitchell Starc", email: "starc@zamcare.com" },
    { name: "Dr. Thomas Zoltan", email: "zoltan@zamcare.com" },
    { name: "Dr. Kate Smith", email: "smith@zamcare.com" },
    { name: "Dr. Hannah Kovács", email: "kovacs@zamcare.com" },
    { name: "Dr. Robert Farkas", email: "farkas@zamcare.com" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();

    let finalEmail = email;

    if (role === "doctor") {
      if (!selectedDoctor) {
        alert("⚠️ Please select your name.");
        return;
      }
      finalEmail = selectedDoctor;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: finalEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };


  return (
    <div className="login-page-wrapper">
      <Navbar />

      <section className="login-page-section">
        <div className="login-content">
          <div className="row align-items-center justify-content-center">
            {/* === LEFT SIDE === */}
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <img
                src="/images/login.png"
                alt="Login Illustration"
                className="login-img img-fluid"
              />
              <h3 className="fw-bold mt-4 text-primary">Welcome Back to ZamCare</h3>
              <p className="text-muted">
                Access your account to view appointments, manage schedules, or connect with patients.
              </p>
            </div>

            {/* === RIGHT SIDE === */}
            <div className="col-md-6">
              <div className="login-form shadow-sm p-4 rounded bg-white">
                <h4 className="fw-bold mb-3 text-primary">Login to Your Account</h4>

                <form onSubmit={handleLogin}>
                  {/* Role Selection */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Login As</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>

                  {/* Doctor Dropdown (if role = doctor) */}
                  {role === "doctor" && (
                    <div className="mb-3 text-start">
                      <label className="form-label fw-semibold">Select Your Name</label>
                      <select
                        className="form-select"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                      >
                        <option value="">-- Select Doctor --</option>
                        {doctors.map((doc, i) => (
                          <option key={i} value={doc.email}>
                            {doc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Email Field (only for patients) */}
                  {role === "patient" && (
                    <div className="mb-3 text-start">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Password Field */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Login
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-primary fw-semibold">
                      Register here
                    </Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
