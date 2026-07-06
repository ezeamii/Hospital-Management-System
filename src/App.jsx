import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  // ===== Appointment dropdown logic =====
  const departments = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "General Medicine",
  ];

  const doctors = [
    { name: "Dr. Mitchell Starc", departments: ["General Medicine", "Cardiology"] },
    { name: "Dr. Thomas Zoltan", departments: ["Neurology"] },
    { name: "Dr. Kate Smith", departments: ["Dermatology", "Pediatrics"] },
    { name: "Dr. Hannah Kovács", departments: ["Pediatrics"] },
    { name: "Dr. Robert Farkas", departments: ["Dermatology"] },
  ];

  const [selectedDept, setSelectedDept] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Filter doctors when department changes
  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    const matched = doctors.filter((doc) => doc.departments.includes(dept));
    setFilteredDoctors(matched);
  };

  return (
    <div>
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Home Section ===== */}
      <section id="home" className="section">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-between">
            {/* ==== LEFT: Text ==== */}
            <div className="col-md-6 home-text-box">
              <h1 className="fw-bold">We help patients live a healthy, longer life.</h1>
              <p>
                Our experienced doctors provide compassionate care and advanced
                medical solutions for every patient's needs.
              </p>
              <a href="#appointments" className="btn btn-primary mt-3">
                Book an Appointment
              </a>

              <div className="stats mt-4">
                <div>
                  <span className="fw-bold text-primary">30+</span>
                  <br />
                  Years of Experience
                </div>
                <div>
                  <span className="fw-bold text-primary">3</span>
                  <br />
                  Clinic Locations
                </div>
                <div>
                  <span className="fw-bold text-primary">100%</span>
                  <br />
                  Patient Satisfaction
                </div>
              </div>
            </div>

            {/* ==== RIGHT: Images ==== */}
            <div className="col-md-6 d-flex justify-content-center">
              <div className="doctor-gallery">
                <div className="doctor-card bg-orange">
                  <img src="/images/doc1.png" alt="Doctor 1" className="doctor-img1" />
                </div>
                <div className="doctor-card bg-purple">
                  <img src="/images/doc2.png" alt="Doctor 2" className="doctor-img2" />
                </div>
                <div className="doctor-card bg-blue">
                  <img src="/images/doc3.png" alt="Doctor 3" className="doctor-img3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services Section ===== */}
      <section id="services" className="section text-center">
        <div className="container">
          <h2 className="fw-bold mb-3 text-primary">Providing the Best Medical Services</h2>
          <p className="text-muted mb-5">
            World-class care for everyone. Our health system offers unmatched, expert healthcare.
          </p>

          <div className="row justify-content-center">
            {/* ---- Service 1 ---- */}
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <img src="/images/serv1.png" alt="Find a Doctor" className="service-icon" />
                <h5 className="mt-3">Find a Doctor</h5>
                <p className="text-muted">
                  World-class care for everyone. Our health system offers unmatched, expert healthcare.
                </p>
                <a href="/doctors" className="arrow-btn">
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>

            {/* ---- Service 2 ---- */}
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <img src="/images/serv2.png" alt="Find a Location" className="service-icon" />
                <h5 className="mt-3">Find a Location</h5>
                <p className="text-muted">
                  Visit any of our clinics located conveniently near you for personalized care.
                </p>
                <a href="/locations" className="arrow-btn">
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>

            {/* ---- Service 3 ---- */}
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <img src="/images/serv3.png" alt="Book Appointment" className="service-icon" />
                <h5 className="mt-3">Book Appointment</h5>
                <p className="text-muted">
                  Schedule your visit quickly and easily using our online appointment system.
                </p>
                <a href="/appointment" className="arrow-btn">
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Appointment Section ===== */}
      <section id="appointments" className="section text-center">
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT IMAGE */}
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="/images/appoindoc.png"
                alt="Appointment Doctor"
                className="appointment-img img-fluid"
              />
              <h3 className="fw-bold mt-4 text-primary">Book Your Appointment Today</h3>
              <p className="text-muted">
                Your health matters to us. Schedule an appointment with one of our specialists and experience world-class medical care at ZamCare Hospital.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="col-md-6">
              <div className="appointment-form shadow-sm p-4 rounded bg-white">
                <h4 className="fw-bold mb-3 text-primary">Appointment Form</h4>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = {
                      fullName: e.target.fullName.value,
                      email: e.target.email.value,
                      phone: e.target.phone.value,
                      department: e.target.department.value,
                      doctor: e.target.doctor.value,
                      location: e.target.location.value,
                      date: e.target.date.value,
                    };

                    try {
                      const response = await fetch("http://localhost:5000/api/appointments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                      });

                      const data = await response.json();

                      if (response.ok) {
                        alert("✅ Appointment booked successfully!");
                        e.target.reset();
                        setSelectedDept("");
                        setFilteredDoctors([]);
                      } else {
                        console.error("Appointment booking failed:", data);
                        alert("❌ " + (data.error || data.message || "Unknown server error."));
                      }
                    } catch (error) {
                      console.error("Error:", error);
                      alert("⚠️ Could not connect to server.");
                    }
                  }}
                >
                  {/* Full Name */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      name="department"
                      value={selectedDept}
                      onChange={handleDeptChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, i) => (
                        <option key={i} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Doctor</label>
                    <select className="form-select" name="doctor" required>
                      <option value="">Select Doctor</option>
                      {(selectedDept ? filteredDoctors : doctors).map((doc, i) => (
                        <option key={i} value={doc.name}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Preferred Location</label>
                    <select className="form-select" name="location" required>
                      <option value="">Select Location</option>
                      <option>Budapest Central Clinic</option>
                      <option>Debrecen Medical Center</option>
                      <option>Szeged Family Hospital</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Preferred Date</label>
                    <input type="date" name="date" className="form-control" required />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Confirm Appointment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact Section ===== */}
      <section id="contact" className="section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0 text-start">
              <h2 className="fw-bold text-primary mb-3">Contact Us</h2>
              <p className="text-muted">
                Have questions or need assistance? Our team is always here to help.
                Reach out to us through any of the options below.
              </p>
              <ul className="list-unstyled mt-4">
                <li className="mb-3">
                  <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                  123 ZamCare Avenue, Budapest, Hungary
                </li>
                <li className="mb-3">
                  <i className="bi bi-telephone-fill text-primary me-2"></i>
                  +123 456 789
                </li>
                <li className="mb-3">
                  <i className="bi bi-envelope-fill text-primary me-2"></i>
                  info@zamcare.com
                </li>
              </ul>
              <div className="social-icons mt-4">
                <a href="#" className="me-3 text-primary fs-5">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="me-3 text-primary fs-5">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="me-3 text-primary fs-5">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" className="text-primary fs-5">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="col-md-6">
              <div className="contact-form shadow-sm p-4 rounded bg-white">
                <h4 className="fw-bold mb-3 text-primary">Send a Message</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.target.reset();
                    alert("✅ Message sent successfully! We'll get back to you soon.");
                  }}
                >
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;
