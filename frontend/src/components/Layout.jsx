import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Layout wrapper for authenticated routes

export default function Layout() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// Refresh status
