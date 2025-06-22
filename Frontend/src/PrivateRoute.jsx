import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./IsAuthenticated.jsx";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return children;
}
