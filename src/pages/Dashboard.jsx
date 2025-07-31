// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchWithAuth, logout } from "../utils/auth.js";
import { API_BASE } from "../config.js";
import "../css/pages/dashboard.css";
import { useNavigate } from "react-router-dom";
import ProfileImageUploader from "../components/ProfileImageUploader.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/auth/me`);
        if (!res.ok) {
          logout();
          navigate("/login");
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error("Failed to load user:", e);
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const handleImageUpdate = (newUrl) => {
    setUser((u) => (u ? { ...u, imageUrl: newUrl } : u));
  };

  if (loading) {
    return <div className="page dashboard">Loading...</div>;
  }

  if (!user) {
    return <div className="page dashboard">User info not available.</div>;
  }

  return (
    <div className="page dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button onClick={doLogout}>Logout</button>
      </div>

      <div className="profile-wrapper" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Avatar imageUrl={user.imageUrl} size={96} alt={user.name} />
          <ProfileImageUploader currentUrl={user.imageUrl} onUpdate={handleImageUpdate} />
        </div>

        <div className="profile">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Provider:</strong> {user.provider}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}
