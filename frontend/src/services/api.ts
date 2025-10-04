import axios, {type AxiosInstance} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

console.log(import.meta.env.VITE_API_URL);

export default api;