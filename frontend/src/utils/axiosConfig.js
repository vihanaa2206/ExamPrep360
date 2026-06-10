import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const code   = err.response?.data?.code;
    const msg    = (err.response?.data?.error || "").toLowerCase();

    if (
      status === 403 &&
      (code === "ACCOUNT_SUSPENDED" ||
        msg.includes("block") ||
        msg.includes("suspend"))
    ) {
      localStorage.clear();
      window.location.href = "/login?reason=suspended";
      return Promise.reject(err);
    }

    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

export default api;
