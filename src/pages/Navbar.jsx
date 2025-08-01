// src/pages/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth, logout, isAuthenticated } from "../utils/auth.js";
import { API_BASE } from "../config.js";
import Avatar from "../components/Avatar.jsx";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      return;
    }
    try {
      const res = await fetchWithAuth(`${API_BASE}/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
        setUser(null);
      }
    } catch (e) {
      console.warn("Failed to fetch current user in navbar", e);
      logout();
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleAuthChange = () => {
      if (!isAuthenticated()) {
        setUser(null);
      } else {
        fetchUser();
      }
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar"
      style={{
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        fontFamily:
          '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        gap: 12,
      }}
    >
      <div className="logo">
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 18,
            color: "#6366f1",
          }}
        >
          Spark✨
        </Link>
      </div>
      <div
        className="links"
        style={{ display: "flex", alignItems: "center", gap: 16 }}
      >
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                style={{
                  marginRight: 8,
                  textDecoration: "none",
                  color: "#6366f1",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Admin
              </Link>
            )}
            <Link
              to="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "#1f2d3a",
              }}
            >
              <Avatar imageUrl={user.imageUrl} size={32} alt={user.name} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {user.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              style={{
                padding: "8px 14px",
                background: "#f5f7fa",
                color: "#1f2d3a",
                border: "1px solid #d1d9e6",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "background .2s ease, filter .2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(99,102,241,0.5)";
                e.currentTarget.style.outline = "none";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#6366f1",
                fontWeight: 600,
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#6366f1",
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
