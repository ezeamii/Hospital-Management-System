import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../App.css";

const departments = [
  "General Medicine",
  "Pediatrics",
  "Dermatology",
  "Cardiology",
  "Neurology",
];

const doctors = [
  { name: "Dr. Mitchell Starc", departments: ["General Medicine", "Cardiology"] },
  { name: "Dr. Thomas Zoltan", departments: ["Neurology"] },
  { name: "Dr. Kate Smith", departments: ["Dermatology", "Pediatrics"] },
  { name: "Dr. Hannah Kovács", departments: ["Pediatrics"] },
  { name: "Dr. Robert Farkas", departments: ["Dermatology"] },
];

function AppointmentPage() {
  const [selectedDept, setSelectedDept] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableDepts, setAvailableDepts] = useState(departments); // what i am using for dynamic dropdown

  //  Prefill if selected from other pages
  useEffect(() => {
    const savedDoctor = JSON.parse(localStorage.getItem("selectedDoctor"));
    const savedLocation = JSON.parse(localStorage.getItem("selectedLocation"));

    //  If coming from Find a Doctor page
    if (savedDoctor && !savedLocation) {
      // Clear any previously stored location data
      localStorage.removeItem("selectedLocation");

      setSelectedDoctor(savedDoctor.name);
      setAvailableDepts(savedDoctor.departments);
      setSelectedDept(savedDoctor.departments[0]);

      const matched = doctors.filter((doc) =>
        doc.departments.includes(savedDoctor.departments[0])
      );
      setFilteredDoctors(matched);

      //  Also clear the location field in state
      setSelectedLocation("");
    }

    //  If coming from Locations page
    else if (savedLocation && !savedDoctor) {
      // Clear any previously stored doctor data
      localStorage.removeItem("selectedDoctor");

      setSelectedLocation(savedLocation.name);

      // Reset other states so only location is filled
      setSelectedDept("");
      setSelectedDoctor("");
      setAvailableDepts(departments);
      setFilteredDoctors([]);
    }

    //  If visiting Appointment directly (no stored data)
    else {
      // Clear *everything*
      localStorage.removeItem("selectedDoctor");
      localStorage.removeItem("selectedLocation");

      setSelectedDept("");
      setSelectedDoctor("");
      setSelectedLocation("");
      setAvailableDepts(departments);
      setFilteredDoctors([]);
    }
  }, []);




  //  Handle department change manually
  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setSelectedDoctor("");

    // Filter doctors under selected dept
    const matched = doctors.filter((doc) => doc.departments.includes(dept));
    setFilteredDoctors(matched);
  };

  // Updated handleSubmit to connect to backend (MongoDB)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      department: selectedDept,
      doctor: selectedDoctor,
      location: selectedLocation,
      date: e.target.date.value,
      time: e.target.time.value,
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("⚠️ Please log in before booking an appointment.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Appointment booked successfully!");
        e.target.reset();
        setSelectedDept("");
        setSelectedDoctor("");
        setSelectedLocation("");
        setFilteredDoctors([]);
        setAvailableDepts(departments);
        localStorage.removeItem("selectedDoctor");
        localStorage.removeItem("selectedLocation");
      } else {
        console.error("Appointment booking failed:", data);

        if (data.message === "Time slot already taken") {
          alert("⚠️ Time slot already taken");
        } else {
          alert("❌ " + (data.message || data.error || "Something went wrong."));
        }
      }
    } catch (error) {
      console.error("❌ Network or server error:", error);
      alert("⚠️ Could not connect to the server. Please try again later.");
    }
  };


  return (
    <div className="appointment-page-wrapper">
      <Navbar />

      <section className="appointment-page-section">
        <div className="appointment-content">
          <div className="row align-items-center justify-content-center">
            {/* LEFT SIDE */}
            <div className="col-md-6 mb-4 mb-md-0 text-center">
              <img
                src="/images/appoindoc.png"
                alt="Appointment Doctor"
                className="appointment-img img-fluid"
              />
              <h3 className="fw-bold mt-4 text-primary">
                Book Your Appointment Today
              </h3>
              <p className="text-muted">
                Your health matters to us. Schedule an appointment with one of our specialists
                and experience world-class care at ZamCare Hospital.
              </p>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="col-md-6">
              <div className="appointment-form shadow-sm p-4 rounded bg-white">
                <h4 className="fw-bold mb-3 text-primary">Appointment Form</h4>
                <form onSubmit={handleSubmit}>
                  {/* Name */}
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
                      value={selectedDept}
                      onChange={handleDeptChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {availableDepts.map((dept, i) => (
                        <option key={i} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Select Doctor</label>
                    <select
                      className="form-select"
                      name="doctor"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      disabled={!selectedDept && !selectedDoctor}
                      required
                    >
                      <option value="">
                        {selectedDept || selectedDoctor
                          ? "Select Doctor"
                          : "Select a Department First"}
                      </option>

                      {filteredDoctors.map((doc, i) => (
                        <option key={i} value={doc.name}>
                          {doc.name}
                        </option>
                      ))}

                      {selectedDoctor &&
                        !filteredDoctors.find((d) => d.name === selectedDoctor) && (
                          <option value={selectedDoctor}>{selectedDoctor}</option>
                        )}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Preferred Location</label>
                    <select
                      className="form-select"
                      name="location"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      required
                    >
                      <option value="">Select Location</option>
                      <option>Budapest Central Clinic</option>
                      <option>Debrecen Medical Center</option>
                      <option>Szeged Family Hospital</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Preferred Time</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      required
                    />
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
    </div>
  );
}

export default AppointmentPage;
