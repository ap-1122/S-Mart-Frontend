import axios from 'axios';

// Backend ka base URL
const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIX: Request Interceptor (Har request ke sath Token bhejne ke liye)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Token nikalo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Header me jodo
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;











// import axios from 'axios';

// // Backend ka base URL (Change karna aasaan hoga baad mein)
// const API_URL = "http://localhost:8080/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;