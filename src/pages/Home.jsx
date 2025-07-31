// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth.js";
import "../css/pages/home.css";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="page home">
      <h1>Welcome</h1>
      <p>
        Please <Link to="/login">log in</Link> or <Link to="/register">register</Link>, or go to your{" "}
        <Link to="/dashboard">dashboard</Link>.
      </p>
    </div>
  );
}
