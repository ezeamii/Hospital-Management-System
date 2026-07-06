import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // if no token, redirect to login
  if (!token) {
    alert("⚠️ Please log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  // else, render the protected content
  return children;
}

export default ProtectedRoute;
