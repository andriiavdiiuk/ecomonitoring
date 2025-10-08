import axios, {type AxiosInstance} from "axios";

import Cookies from "universal-cookie";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(config => {
    const cookies = new Cookies();
    const token = cookies.get("jwt") as unknown
    if (token && typeof token === "string") {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error:unknown) => {
    if (error instanceof Error) {
        return Promise.reject(error);
    }
});


export default api;