import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
});

// Automatically attach JWT token to requests
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const registerUser = (data) => {
    return API.post("/register", data);
};

export const loginUser = (data) => {
    return API.post("/login", data);
};

export default API;