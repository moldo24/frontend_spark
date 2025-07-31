// src/components/ProfileImageUploader.jsx
import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/auth.js";
import { API_BASE } from "../config.js";
import Avatar from "./Avatar.jsx";

export default function ProfileImageUploader({ currentUrl, onUpdate, size = 64, name }) {
  const [localFile, setLocalFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [remoteUrl, setRemoteUrl] = useState(currentUrl);

  // sync remoteUrl when parent updates, but don’t override while editing a local file
  useEffect(() => {
    if (!localFile) {
      setRemoteUrl(currentUrl);
    }
  }, [currentUrl, localFile]);

  // create object URL for the selected file
  const [objectUrl, setObjectUrl] = useState(null);
  useEffect(() => {
    if (localFile) {
      const url = URL.createObjectURL(localFile);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(null);
    }
  }, [localFile]);

  const preview = objectUrl
    ? objectUrl
    : remoteUrl
    ? remoteUrl.startsWith("http")
      ? remoteUrl
      : `${API_BASE}${remoteUrl}`
    : "/default-avatar.png";

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Only PNG/JPEG allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Max 2MB");
      return;
    }
    setError(null);
    setLocalFile(file);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetchWithAuth(`${API_BASE}/auth/me/image`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const body = await res.json();
      onUpdate && onUpdate(body.imageUrl);
      // clear localFile so the new remoteUrl (saved path) is used
      setLocalFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-uploader" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar imageUrl={preview} size={size} alt={name || "avatar"} />
        <div>
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            Change image
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </label>
          {uploading && <div style={{ fontSize: 12 }}>Uploading...</div>}
          {error && (
            <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
