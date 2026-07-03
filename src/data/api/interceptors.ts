import axios from 'axios';
import type {IErrorResponse} from "../../types/api.type.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
	'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
	if (error.response && error.response.status === 401 && window.location.pathname !== '/login') {
	    window.location.href = '/login';
	}
	return Promise.reject(error.response.data as IErrorResponse);
    }
);

export default api;