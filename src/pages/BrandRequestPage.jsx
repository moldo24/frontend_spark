import { useState } from "react";
import { fetchWithAuth } from "../utils/auth";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function BrandRequestPage() {
  const [form, setForm] = useState({ name: "", slug: "", logoUrl: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetchWithAuth(`${API_BASE}/brands/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", slug: "", logoUrl: "" });
      } else {
        const err = await res.json();
        setError(err.message || "Request failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2>Request a New Brand</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Slug:
          <input name="slug" value={form.slug} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Logo URL (optional):
          <input name="logoUrl" value={form.logoUrl} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit Request</button>
      </form>
      {success && <p style={{ color: "green" }}>Request submitted!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
