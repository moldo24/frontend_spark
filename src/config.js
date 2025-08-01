// central place for all API endpoints; override via env if needed
export const API_BASE = process.env.REACT_APP_USER_API_BASE || "http://localhost:8080";

export const AUTH = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  ME: `${API_BASE}/auth/me`,
  UPLOAD_IMAGE: `${API_BASE}/auth/me/image`,
  GET_IMAGE: `${API_BASE}/auth/me/image`,
};

export const OAUTH2 = {
  GOOGLE: `${API_BASE}/oauth2/authorize/google`,
  GITHUB: `${API_BASE}/oauth2/authorize/github`,
};
