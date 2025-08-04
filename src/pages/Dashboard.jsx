// src/pages/Dashboard.jsx
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard - Spark";
  }, []);

  return (
    <div className="page dashboard">
      <h2>Dashboard</h2>
      <p>This is your dashboard. Features coming soon.</p>
    </div>
  );
}
