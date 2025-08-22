// src/config.js
export const USER_API_BASE = process.env.REACT_APP_USER_API_BASE || "http://localhost:8080";
export const STORE_API_BASE = process.env.REACT_APP_STORE_API_BASE || "http://localhost:8081";

// kept for backwards compatibility / existing auth/user code
export const API_BASE = USER_API_BASE;

export const AUTH = {
  LOGIN: `${USER_API_BASE}/auth/login`,
  REGISTER: `${USER_API_BASE}/auth/register`,
  ME: `${USER_API_BASE}/auth/me`,
  UPLOAD_IMAGE: `${USER_API_BASE}/auth/me/image`,
  GET_IMAGE: `${USER_API_BASE}/auth/me/image`,
};

export const OAUTH2 = {
  GOOGLE: `${USER_API_BASE}/oauth2/authorize/google`,
  GITHUB: `${USER_API_BASE}/oauth2/authorize/github`,
};

export const BRAND = {
  BASE: STORE_API_BASE,
  LIST: (q = "") => {
    if (q && q.trim()) {
      return `${STORE_API_BASE}/brands?q=${encodeURIComponent(q.trim())}`;
    }
    return `${STORE_API_BASE}/brands`;
  },
};

export const BRAND_REQUESTS = {
  LIST: (status = "") =>
    status && status.trim()
      ? `${STORE_API_BASE}/brands/requests?status=${encodeURIComponent(status.trim())}`
      : `${STORE_API_BASE}/brands/requests`,
  APPROVE: (id) => `${STORE_API_BASE}/brands/requests/${id}/approve`,
  REJECT:  (id) => `${STORE_API_BASE}/brands/requests/${id}/reject`,
  MINE:    () => `${STORE_API_BASE}/brands/requests/mine`,
  LOGO_PUT: (id) => `${STORE_API_BASE}/brands/requests/${id}/logo`,
  LOGO_GET: (id) => `${STORE_API_BASE}/brands/requests/${id}/logo`,
};
