import axios from "axios";
import { URL } from '../http/url';

const api = axios.create({
  //baseURL: "http://127.0.0.1:8000",
  //baseURL: "https://marusina-sweets.onrender.com",
  baseURL: URL.urlJWTbaseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;