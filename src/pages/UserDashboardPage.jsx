import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";

function UserDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [viewDiagnosis, setViewDiagnosis] = useState(null); // ⭐ New

  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
    time: "",
    location: "",
  });

  const token = localStorage.getItem("token");

  /* ============================================
     Doctor → Department
  ============================================= */
  const doctorDepartments = {
    "Dr. Mitchell Starc": "Cardiology",
    "Dr. Thomas Zoltan": "Neurology",
    "Dr. Kate Smith": "Dermatology",
    "Dr. Hannah Kovács": "Pediatrics",
    "Dr. Robert Farkas": "General Medicine",
  };

  /* ============================================
     Doctor → Location
  ============================================= */
  const doctorLocations = {
    "Dr. Mitchell Starc": "Debrecen Medical Center",
    "Dr. Thomas Zoltan": "Budapest Central Clinic",
    "Dr. Kate Smith": "Budapest Central Clinic",
    "Dr. Hannah Kovács": "Nyíregyháza Health Point",
    "Dr. Robert Farkas": "Miskolc General Hospital",
  };

  /* ============================================
     FETCH APPOINTMENTS
  ============================================= */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setAppointments(data.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [token]);

  /* ============================================
     CANCEL APPOINTMENT
  ============================================= */
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      await res.json();

      if (res.ok) {
        alert("Appointment cancelled.");
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === id ? { ...a, status: "Cancelled" } : a
          )
        );
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  /* ============================================
     OPEN EDIT MODAL
  ============================================= */
  const openEditModal = (appt) => {
    setEditing(appt);
    setFormData({
      department: appt.department,
      doctor: appt.doctor,
      date: appt.date.split("T")[0],
      time: appt.time || "",
      location: appt.location,
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ============================================
     UPDATE APPOINTMENT
  ============================================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${editing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      // const data = await res.json();

      if (res.ok) {
        alert("Appointment updated!");
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === editing._id ? { ...a, ...formData } : a
          )
        );
        setEditing(null);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ============================================
     FILTER APPOINTMENTS
  ============================================= */
  const pendingAppointments = appointments.filter(
    (a) => a.status !== "Completed" && a.status !== "Cancelled"
  );

  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed"
  );

  const cancelledAppointments = appointments.filter(
    (a) => a.status === "Cancelled"
  );

  /* ============================================
     RENDER PAGE
  ============================================= */
  return (
    <div className="user-dashboard-page">
      <Navbar />

      <div className="page-wrapper container">
        <h2 className="fw-bold text-primary mb-4">My Appointments</h2>

        {/* UPCOMING */}
        <h4 className="fw-bold text-warning mb-3">Upcoming Appointments</h4>
        {pendingAppointments.length === 0 ? (
          <p className="text-muted">No upcoming appointments.</p>
        ) : (
          <div className="table-responsive mb-5">
            <table className="table table-striped align-middle">
              <thead className="table-warning">
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.doctor}</td>
                    <td>{appt.department}</td>
                    <td>{appt.location}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time || "Not specified"}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => openEditModal(appt)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancel(appt._id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMPLETED */}
        <h4 className="fw-bold text-success mb-3">Completed Appointments</h4>
        {completedAppointments.length === 0 ? (
          <p className="text-muted">No completed appointments.</p>
        ) : (
          <div className="table-responsive mb-5">
            <table className="table table-striped align-middle">
              <thead className="table-success">
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Diagnosis</th> {/* ⭐ NEW COLUMN */}
                </tr>
              </thead>
              <tbody>
                {completedAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.doctor}</td>
                    <td>{appt.department}</td>
                    <td>{appt.location}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time || "Not specified"}</td>
                    <td>
                      <span className="badge bg-success">Completed</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setViewDiagnosis(appt)}
                      >
                        View Diagnosis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CANCELLED */}
        <h4 className="fw-bold text-danger mb-3">Cancelled Appointments</h4>
        {cancelledAppointments.length === 0 ? (
          <p className="text-muted">No cancelled appointments.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-danger">
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cancelledAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.doctor}</td>
                    <td>{appt.department}</td>
                    <td>{appt.location}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time || "Not specified"}</td>
                    <td>
                      <span className="badge bg-danger">Cancelled</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
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
                <strong>Doctor:</strong> {viewDiagnosis.doctor}
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
                {viewDiagnosis.diagnosis
                  ? viewDiagnosis.diagnosis
                  : "No diagnosis added yet."}
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

      {/* =====================================================
          EDIT MODAL (UNCHANGED FROM BEFORE)
      ====================================================== */}
      {editing && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5 className="fw-bold text-primary mb-3">Edit Appointment</h5>

              <form onSubmit={handleUpdate}>

                {/* Department */}
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => {
                      const dept = e.target.value;

                      const defaultDoctor = Object.keys(doctorDepartments).find(
                        (doc) => doctorDepartments[doc] === dept
                      );

                      setFormData({
                        ...formData,
                        department: dept,
                        doctor: defaultDoctor || "",
                        location: defaultDoctor
                          ? doctorLocations[defaultDoctor]
                          : "",
                      });
                    }}
                    required
                  >
                    <option value="">Select Department</option>
                    {[...new Set(Object.values(doctorDepartments))].map(
                      (dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Doctor */}
                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <select
                    name="doctor"
                    className="form-select"
                    value={formData.doctor}
                    onChange={(e) => {
                      const doctorName = e.target.value;
                      setFormData({
                        ...formData,
                        doctor: doctorName,
                        location: doctorLocations[doctorName],
                      });
                    }}
                    required
                  >
                    <option value="">Select Doctor</option>

                    {Object.entries(doctorDepartments)
                      .filter(([, dept]) => dept === formData.department)
                      .map(([doctorName]) => (
                        <option key={doctorName} value={doctorName}>
                          {doctorName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Location */}
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <select
                    name="location"
                    className="form-select"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option>Budapest Central Clinic</option>
                    <option>Debrecen Medical Center</option>
                    <option>Szeged Family Hospital</option>
                  </select>
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboardPage;
