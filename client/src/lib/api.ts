import useAuth from "@/hooks/useAuth";
import axios from "axios";

export let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);

  //   console.log("token for set ", token)
};

const localToken = localStorage.getItem("accessToken");

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // e.g., 10 seconds'
  withCredentials: true, // IMPORTANT: send cookies (HTTP-only token)
});

API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${localToken}`;
    // console.log("accesstoken in header: ", accessToken);
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: any[] = [];

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { withCredentials: true }
        );
        console.log("inception: ", data);
        setAccessToken(data.accessToken);

        pendingRequests.forEach((p) => p.resolve(data.accessToken));
        pendingRequests = [];

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (err) {
        pendingRequests.forEach((p) => p.reject(err));
        pendingRequests = [];
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;

          if (status === 401 || status === 403) {
            // refresh token invalid → real logout
            const { user, setUser } = useAuth();

            setUser(null);
            // setAccessToken(null);
            setAccessToken(null);

            // optional: redirect to login
            // navigate("/login");
          }
        }

        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
