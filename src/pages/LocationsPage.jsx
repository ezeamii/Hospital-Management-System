import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";

function LocationsPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    {
      id: 1,
      name: "Budapest Central Clinic",
      address: "123 ZamCare Street, Budapest, Hungary",
      image: "/images/serv1.png",
    },
    {
      id: 2,
      name: "Debrecen Medical Center",
      address: "45 Health Boulevard, Debrecen, Hungary",
      image: "/images/serv2.png",
    },
    {
      id: 3,
      name: "Szeged Family Hospital",
      address: "89 Wellness Road, Szeged, Hungary",
      image: "/images/serv3.png",
    },
  ];

  const handleNext = () => {
    if (selectedLocation) {
      //  Clear any previously saved doctor
      localStorage.removeItem("selectedDoctor");

      //  Save the selected location
      localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));

      //  Redirect to the appointment page
      window.location.href = "/appointment";
    }
  };


  return (
    <div className="location-page-wrapper">
      <Navbar />

      <section className="location-page-section text-center">
        <div className="doctor-content">
          <h2 className="fw-bold text-primary mb-3">Our Hospital Locations</h2>
          <p className="text-muted mb-5">
            Visit any of our ZamCare clinics conveniently located across Hungary.
          </p>

          {locations.map((loc) => (
            <div
              key={loc.id}
              className="d-flex align-items-center justify-content-between shadow-sm p-3 mb-3 rounded bg-white"
            >
              <div className="d-flex align-items-center text-start">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="rounded me-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                <div>
                  <h5 className="fw-bold text-dark">{loc.name}</h5>
                  <p className="text-muted small mb-0">{loc.address}</p>
                </div>
              </div>

              <button
                className={`btn ${
                  selectedLocation?.name === loc.name
                    ? "btn-success"
                    : "btn-outline-primary"
                }`}
                onClick={() => setSelectedLocation(loc)}
              >
                {selectedLocation?.name === loc.name ? "Selected" : "Select"}
              </button>
            </div>
          ))}

          {selectedLocation && (
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

export default LocationsPage;
