import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";

function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState([]);

  // Diagnosis input modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");

  // Diagnosis view modal
  const [viewDiagnosis, setViewDiagnosis] = useState(null);

  const [, setLoading] = useState(true);

  /* ===========================
     FETCH DOCTOR APPOINTMENTS
  ============================ */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/appointments/doctor",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok) setAppointments(data.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ===========================
     OPEN DIAGNOSIS ENTRY MODAL
  ============================ */
  const openDiagnosisModal = (appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis("");
  };

  /* ===========================
     SUBMIT DIAGNOSIS
  ============================ */
  const submitDiagnosis = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/complete/${selectedAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ diagnosis }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Appointment completed with diagnosis!");

        // Update UI
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === selectedAppointment._id
              ? { ...a, status: "Completed", diagnosis }
              : a
          )
        );

        setSelectedAppointment(null);
        setDiagnosis("");
      } else {
        alert(data.message || "Failed to save diagnosis.");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
    }
  };

  /* ===========================
     FILTER APPOINTMENTS
  ============================ */
  const upcoming = appointments.filter((a) => a.status === "Pending");
  const completed = appointments.filter((a) => a.status === "Completed");
  const cancelled = appointments.filter((a) => a.status === "Cancelled");

  return (
    <div className="doctor-dashboard-wrapper">
      <Navbar />

      <section className="doctor-wrapper container">
        <h2 className="text-primary fw-bold mt-4">Doctor Dashboard</h2>

        {/* Upcoming */}
        <h4 className="text-warning mt-4">Upcoming Appointments</h4>
        {upcoming.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <AppointmentTable
            appointments={upcoming}
            onComplete={openDiagnosisModal}
          />
        )}

        {/* Completed */}
        <h4 className="text-success mt-4">Completed Appointments</h4>
        {completed.length === 0 ? (
          <p>No completed appointments.</p>
        ) : (
          <AppointmentTable
            appointments={completed}
            onViewDiagnosis={setViewDiagnosis}
          />
        )}

        {/* Cancelled */}
        <h4 className="text-danger mt-4">Cancelled Appointments</h4>
        {cancelled.length === 0 ? (
          <p>No cancelled appointments.</p>
        ) : (
          <AppointmentTable appointments={cancelled} />
        )}
      </section>

      {/* ======================================================
           DIAGNOSIS ENTRY MODAL
      ====================================================== */}
      {selectedAppointment && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5 className="fw-bold text-primary mb-3">
                Enter Diagnosis for{" "}
                {selectedAppointment.fullName ||
                  selectedAppointment.userId?.name}
              </h5>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedAppointment.date).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong> {selectedAppointment.time || "Not specified"}
              </p>

              <textarea
                className="form-control"
                rows="4"
                placeholder="Diagnosis details..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              ></textarea>

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={submitDiagnosis}>
                  Save Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
           VIEW DIAGNOSIS MODAL
      ====================================================== */}
      {viewDiagnosis && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5 className="fw-bold text-primary mb-3">Diagnosis</h5>

              <p>
                <strong>Patient:</strong>{" "}
                {viewDiagnosis.fullName || viewDiagnosis.userId?.name || "N/A"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(viewDiagnosis.date).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong> {viewDiagnosis.time || "Not specified"}
              </p>

              <p>
                <strong>Diagnosis:</strong>
                <br />
                {viewDiagnosis.diagnosis || "No diagnosis entered."}
              </p>

              <div className="text-end">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewDiagnosis(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================
     TABLE COMPONENT
=========================== */
function AppointmentTable({ appointments, onComplete, onViewDiagnosis }) {
  return (
    <table className="table table-striped mt-3">
      <thead className="table-light">
        <tr>
          <th>Patient</th>
          <th>Email</th>
          <th>Date</th>
          <th>Time</th>
          <th>Location</th>
          <th>Status</th>
          {onComplete && <th>Action</th>}
          {onViewDiagnosis && <th>Diagnosis</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt) => (
          <tr key={appt._id}>
            <td>{appt.fullName || appt.userId?.name || "N/A"}</td>
            <td>{appt.email || appt.userId?.email || "N/A"}</td>
            <td>{new Date(appt.date).toLocaleDateString()}</td>
            <td>{appt.time || "Not specified"}</td>
            <td>{appt.location}</td>

            <td>
              <span
                className={`badge ${
                  appt.status === "Pending"
                    ? "bg-warning text-dark"
                    : appt.status === "Completed"
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {appt.status}
              </span>
            </td>

            {onComplete && appt.status !== "Completed" && (
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onComplete(appt)}
                >
                  Mark Completed
                </button>
              </td>
            )}

            {onViewDiagnosis && (
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => onViewDiagnosis(appt)}
                >
                  View Diagnosis
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DoctorDashboardPage;
