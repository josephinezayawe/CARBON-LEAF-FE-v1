import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://carbonleafs.com",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // If you store token in localStorage, keep this; otherwise cookies handle it via withCredentials: true
        const token = typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);

        const requestUrl = error.config?.url || "";
        const isAuthRoute = requestUrl.includes("auth/login") || requestUrl.includes("auth/register") || requestUrl.includes("auth/verify");

        // Do not trigger page redirects on failed login/signup requests
        if (error.response?.status === 401 && !isAuthRoute) {
            if (typeof window !== "undefined" && window.location.pathname !== "/signup") {
                window.location.href = "/signup";
            }
        }

        return Promise.reject(error);
    }
);

export default api;