// src/components/admin/UserForm.jsx
import { useState, useEffect } from "react";

const emailRegex = /^\S+@\S+\.\S+$/;
const roles = ["USER", "ADMIN"];
const providers = ["LOCAL", "GOOGLE", "GITHUB"];

const DEFAULT_INITIAL = {
  name: "",
  email: "",
  password: "",
  provider: "LOCAL",
  providerId: "",
  role: "USER",
  emailVerified: false,
};

function validate({ name, email, password, provider, providerId }, isNew) {
  const errors = {};
  if (!name || !name.trim()) errors.name = "Name is required";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!email || !email.trim()) errors.email = "Email is required";
  else if (!emailRegex.test(email.trim())) errors.email = "Invalid email";

  if (provider === "LOCAL") {
    if (isNew) {
      if (!password) errors.password = "Password is required";
      else if (password.length < 8) errors.password = "Password must be >=8 chars";
    } else if (password && password.length < 8) {
      errors.password = "Password must be >=8 chars";
    }
  } else {
    if (!providerId || !providerId.trim()) {
      errors.providerId = "Provider ID required for OAuth user";
    }
  }
  return errors;
}

export default function UserForm({
  initial,
  isNew = true,
  onCancel,
  onSubmit,
  submitting,
}) {
  const effectiveInitial = initial ?? DEFAULT_INITIAL;
  const [form, setForm] = useState(() => ({ ...effectiveInitial }));
  const [errors, setErrors] = useState({});

  // Only reset when the actual initial fields change (not on every render)
  useEffect(() => {
    setForm({ ...effectiveInitial });
    setErrors({});
  }, [
    effectiveInitial.name,
    effectiveInitial.email,
    effectiveInitial.provider,
    effectiveInitial.providerId,
    effectiveInitial.role,
    effectiveInitial.emailVerified,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form, isNew);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    await onSubmit(form);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            disabled={submitting}
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div className="field">
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            disabled={submitting}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className="field">
          <label>Provider</label>
          <select
            value={form.provider}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                provider: e.target.value,
                password: "",
                providerId: "",
              }))
            }
            disabled={submitting}
          >
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        {form.provider === "LOCAL" && (
          <div className="field">
            <label>{isNew ? "Password" : "New Password (optional)"}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              disabled={submitting}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>
        )}
        {form.provider !== "LOCAL" && (
          <div className="field">
            <label>Provider ID</label>
            <input
              value={form.providerId}
              onChange={(e) => setForm((f) => ({ ...f, providerId: e.target.value }))}
              disabled={submitting}
            />
            {errors.providerId && <div className="field-error">{errors.providerId}</div>}
          </div>
        )}
        <div className="field">
          <label>Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            disabled={submitting}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="field email-verified">
          <label>Email Verified</label>
          <div className="checkbox-wrap">
            <input
              type="checkbox"
              checked={form.emailVerified}
              onChange={(e) => setForm((f) => ({ ...f, emailVerified: e.target.checked }))}
              disabled={submitting}
            />
            <span>{form.emailVerified ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {isNew ? (submitting ? "Creating..." : "Create user") : submitting ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
