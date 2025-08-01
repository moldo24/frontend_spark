// src/components/admin/UserRow.jsx
import { useState } from "react";
import Avatar from "../Avatar.jsx";
import ProviderIcon from "./ProviderIcon.jsx";
import { fetchWithAuth } from "../../utils/auth.js";

export default function UserRow({ user, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isLocal = user.provider === "LOCAL";

  const handleSave = async () => {
    setErrors({});
    const payload = {};
    if (form.name.trim() !== user.name) payload.name = form.name.trim();
    if (form.email.trim().toLowerCase() !== user.email) payload.email = form.email.trim().toLowerCase();
    if (form.role && form.role !== user.role) payload.role = form.role;
    if (typeof form.emailVerified === "boolean" && form.emailVerified !== user.emailVerified)
      payload.emailVerified = form.emailVerified;
    if (isLocal && form.password) payload.password = form.password;

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const res = await fetchWithAuth(`/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.error && body.error.toLowerCase().includes("email already in use")) {
          setErrors({ email: "Email already in use" });
        } else {
          alert("Update failed: " + (body.error || res.status));
        }
        return;
      }
      onUpdated();
      setEditing(false);
      setForm((f) => ({ ...f, password: "" }));
    } catch (e) {
      alert("Update error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this user?")) {
      onDeleted(user.id);
    }
  };

  return (
    <tr className="user-row">
      <td>
        <Avatar imageUrl={user.imageUrl} size={32} alt={user.name} />
      </td>
      <td>{user.id}</td>
      <td>
        {editing ? (
          <div className="inline-field">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={saving}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
        ) : (
          user.name
        )}
      </td>
      <td>
        {editing ? (
          <div className="inline-field">
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={saving}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
        ) : (
          user.email
        )}
      </td>
      <td className="provider-cell">
        <ProviderIcon provider={user.provider} />
        <span>{user.provider}</span>
      </td>
      <td>
        {editing ? (
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} disabled={saving}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        ) : (
          user.role
        )}
      </td>
      <td>
        {editing ? (
          <label className="checkbox-wrap">
            <input
              type="checkbox"
              checked={form.emailVerified}
              onChange={(e) => setForm((f) => ({ ...f, emailVerified: e.target.checked }))}
              disabled={saving}
            />
            <span>{form.emailVerified ? "Yes" : "No"}</span>
          </label>
        ) : user.emailVerified ? (
          "Yes"
        ) : (
          "No"
        )}
      </td>
      <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
      <td>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}</td>
      <td className="actions-cell">
        {editing ? (
          <>
            {isLocal && (
              <input
                type="password"
                placeholder="New password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                disabled={saving}
                className="small-input"
              />
            )}
            <button onClick={handleSave} className="btn btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setErrors({});
                setForm({
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  emailVerified: user.emailVerified,
                  password: "",
                });
              }}
              className="btn btn-cancel"
              disabled={saving}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="btn btn-edit">
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
