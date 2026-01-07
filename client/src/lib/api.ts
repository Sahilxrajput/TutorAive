// src/api.ts
import axios from "axios";

export let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
//   console.log("token for set ", token)
};


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // e.g., 10 seconds'
  withCredentials: true, // IMPORTANT: send cookies (HTTP-only token)
});

API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          withCredentials: true,
        }
      );
      console.log("interceptors: ", data);
      setAccessToken(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      return API(originalRequest);
    }

    return Promise.reject(error);
  }
);

// export class APIClient<T> {
//   endPoint: string;

//   constructor(endPoint: string) {
//     this.endPoint = endPoint;
//   }

//   getAll = async () => {
//     const { data } = await API.get<{ data: T[] }>(this.endPoint);
//     return data.data;
//   };

//   post = async (payload: T) => {
//     const { data } = await API.post<{ data: T; message: string }>(
//       this.endPoint,
//       payload
//     );
//     toast.success(data.message);
//     return data.data;
//   };

//   get = async (id: string) => {
//     const { data } = await API.get<{ data: T }>(`${this.endPoint}/${id}`);
//     return data.data;
//   };

//   delete = async (id: string) => {
//     //? @issue does data really requires -> for react query to muatate data is required
//     const { data } = await API.delete<{ data: T; message: string }>(
//       `${this.endPoint}/${id}`
//     );
//     // toast.success(data.message);
//   };

//   // @note
//   update = async (id: string, payload: T) => {
//     const { data } = await API.put<{ data: T; message: string }>(
//       `${this.endPoint}/${id}`,
//       payload
//     );
//     toast.success(data.message);
//     return data.data;
//   };
//   patch = async (id: string, payload: T) => {
//     const { data } = await API.patch<{ data: T; message: string }>(
//       `${this.endPoint}/${id}`,
//       payload
//     );
//     toast.success(data.message);
//     return data.data;
//   };
// }

export default API;
