import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:7030/api",
  headers: {
    "Content-Type": "application/json",
  },
});
