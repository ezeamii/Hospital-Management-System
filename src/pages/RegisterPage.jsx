import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "patient", // Always patient
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert("❌ " + (data.message || "Registration failed"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="register-page-wrapper">
      <Navbar />

      <section className="register-page-section">
        <div className="container py-5">
          <div className="row align-items-center justify-content-center">
            {/* LEFT SIDE */}
            <div className="col-md-6 text-center">
              <img
                src="/images/register.png"
                alt="Register Illustration"
                className="register-img img-fluid"
              />
              <h3 className="fw-bold mt-4 text-primary">Join ZamCare Hospital</h3>
              <p className="text-muted">
                Create your patient account to book appointments and access healthcare services.
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-6">
              <div className="login-form shadow-sm p-4 rounded bg-white">
                <h4 className="fw-bold mb-3 text-primary">Patient Registration</h4>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

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
                    Register
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-semibold">
                      Login here
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

export default RegisterPage;
