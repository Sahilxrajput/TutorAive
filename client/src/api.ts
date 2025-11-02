// src/api.ts
import axios from "axios";
import { toast } from "sonner";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // e.g., 10 seconds'
  withCredentials: true, // IMPORTANT: send cookies (HTTP-only token)
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong on server";
    toast.error(message);
    return Promise.reject(error);
  }
);


export default API;
