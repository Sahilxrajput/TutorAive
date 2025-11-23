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
    // toast.error(message);
    return Promise.reject(error);
  }
);

export class APIClient<T> {
  endPoint: string;

  constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  getAll = async () => {
    const { data } = await API.get<{ data: T[] }>(this.endPoint);
    return data.data;
  };

  post = async (payload: T) => {
    const { data } = await API.post<{ data: T; message: string }>(
      this.endPoint,
      payload
    );
    toast.success(data.message);
    return data.data;
  };

  get = async (id: string) => {
    const { data } = await API.get<{ data: T }>(`${this.endPoint}/${id}`);
    return data.data;
  };

  delete = async (id: string) => {
    //? @issue does data really requires -> for react query to muatate data is required 
    const { data } = await API.delete<{data:T, message: string }>(
      `${this.endPoint}/${id}`
    );
    // toast.success(data.message);
  };
  
  // @note
  update = async (id: string, payload: T) => {
    const { data } = await API.put<{ data: T; message: string }>(
      `${this.endPoint}/${id}`,
      payload
    );
    toast.success(data.message);
    return data.data;
  };
  patch = async (id: string, payload: T) => {
    const { data } = await API.patch<{ data: T; message: string }>(
      `${this.endPoint}/${id}`,
      payload
    );
    toast.success(data.message);
    return data.data;
  };




}

export default API;
