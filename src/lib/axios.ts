import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5198/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// On 401: attempt token refresh via HttpOnly cookie, then retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/organisers/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data?.data?.token;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          original.headers.set("Authorization", `Bearer ${newToken}`);
          return api(original);
        }
      } catch {
        // Refresh failed — clear token and redirect to login
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
