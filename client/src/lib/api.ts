import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshAccessToken = async () => {
  // FIX 1: Pass empty object as body `{}` and `{ withCredentials: true }` as the 3rd argument (config)
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );

  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  }

  throw new Error("No access token returned");
};

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops if the refresh call itself failed with 401
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // FIX 2: If there is no access token in storage, the user is a guest browsing publicly.
      // Do NOT attempt to refresh tokens or trigger popups.
      const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
      if (!hasAccessToken) {
        return Promise.reject({ ...error, isSilent: true });
      }

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
        const newToken = await refreshAccessToken();

        pendingRequests.forEach((p) => p.resolve(newToken));
        pendingRequests = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (err) {
        // Clear stale session silently on failure
        localStorage.removeItem("accessToken");

        pendingRequests.forEach((p) => p.reject(err));
        pendingRequests = [];

        // Flag the error as silent so global toast handlers know to ignore it
        return Promise.reject({ ...err, isSilent: true });
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
