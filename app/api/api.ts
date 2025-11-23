import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5000/api/',
    // withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
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

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.error("API Error:", error);


//         if (error.response?.status === 401) {

//             window.location.href = '/signup'
//         }

//         return Promise.reject(error);
//     }
// );

export default api;
