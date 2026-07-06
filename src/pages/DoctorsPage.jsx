import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";

function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Doctor data
  const doctors = [
    {
      name: "Dr. Mitchell Starc",
      departments: ["General Medicine", "Cardiology"],
      rating: 4.8,
    },
    { name: "Dr. Thomas Zoltan", departments: ["Neurology"], rating: 5.0 },
    {
      name: "Dr. Kate Smith",
      departments: ["Dermatology", "Pediatrics"],
      rating: 4.3,
    },
    { name: "Dr. Hannah Kovács", departments: ["Pediatrics"], rating: 4.6 },
    { name: "Dr. Robert Farkas", departments: ["Dermatology"], rating: 4.2 },
  ];

  //  When “Next” is clicked after selecting a doctor
  const handleNext = () => {
    if (selectedDoctor) {
      // Save selected doctor info
      localStorage.setItem("selectedDoctor", JSON.stringify(selectedDoctor));

      // Clear any previously saved location
      localStorage.removeItem("selectedLocation");

      // Redirect to Appointment Page
      window.location.href = "/appointment";
    }
  };

  return (
    <div className="doctor-page-wrapper">
      <Navbar />

      <section className="doctor-page-section text-center">
        <div className="doctor-content">
          <h2 className="fw-bold text-primary mb-3">Meet Our Expert Doctors</h2>
          <p className="text-muted mb-5">
            Browse through our specialists and choose the right doctor for your needs.
          </p>

          {/* ===== Doctor Table ===== */}
          <div className="table-container shadow-sm bg-white rounded p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Doctor</th>
                  <th>Specializations</th>
                  <th>Rating</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{doc.name}</td>
                    <td>
                      {doc.departments.map((dept, i) => (
                        <span key={i} className="badge bg-info text-dark me-1">
                          {dept}
                        </span>
                      ))}
                    </td>
                    <td className="text-warning fw-bold">⭐ {doc.rating}</td>
                    <td>
                      <button
                        className={`btn ${
                          selectedDoctor?.name === doc.name
                            ? "btn-success"
                            : "btn-outline-primary"
                        } btn-sm`}
                        onClick={() => setSelectedDoctor(doc)}
                      >
                        {selectedDoctor?.name === doc.name
                          ? "Selected"
                          : "Select"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Next Button ===== */}
          {selectedDoctor && (
            <div className="mt-4">
              <button onClick={handleNext} className="btn btn-primary px-4">
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DoctorsPage;
