import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Updated to match backend API versioning
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("st_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("st_token");
      localStorage.removeItem("st_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
