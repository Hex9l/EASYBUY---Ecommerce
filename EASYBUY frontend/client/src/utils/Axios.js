import axios from "axios";
import { baseURL, SummaryApi } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// 🔹 Add access token before every request
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🔹 Handle expired access tokens via refresh
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        let originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originalRequest); // retry request with new token
                }
            }
        }

        return Promise.reject(error);
    }
);

// 🔹 Function to get new access token
const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });

        const accessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
    } catch (error) {
        console.error("Refresh token failed:", error);
        return null;
    }
};

export default Axios;
