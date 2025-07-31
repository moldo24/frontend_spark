// src/components/Avatar.jsx
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/auth.js";

export default function Avatar({ imageUrl, size = 64, alt }) {
  const [src, setSrc] = useState("/default-avatar.png");

  useEffect(() => {
    let cancelled = false;
    if (!imageUrl) {
      setSrc("/default-avatar.png");
      return;
    }

    const isLocalSentinel = imageUrl.startsWith("http://localhost:8080/auth/me/image");
    if (isLocalSentinel) {
      (async () => {
        try {
          const res = await fetchWithAuth(imageUrl);
          if (!res.ok) throw new Error("failed to fetch local avatar");
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          if (!cancelled) setSrc(objUrl);
        } catch (e) {
          console.warn("Avatar load error:", e);
          if (!cancelled) setSrc("/default-avatar.png");
        }
      })();
    } else {
      // remote (Google/GitHub) public URL
      setSrc(imageUrl);
    }

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden" }}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
        onError={() => setSrc("/default-avatar.png")}
      />
    </div>
  );
}
