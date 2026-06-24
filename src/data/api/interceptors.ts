import axios from 'axios';
import type {IErrorResponse} from "../../types/api.type.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
	'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
	const token = localStorage.getItem('token');

	if (token) {
	    config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
    },
    (error) => {
	return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
	if (error.response && error.response.status === 401 && window.location.pathname !== '/login') {
	    console.warn('Token kadaluwarsa atau tidak valid, mengalihkan ke login...');
	    localStorage.removeItem('token');
	    window.location.href = '/login';
	}
	return Promise.reject(error.response.data as IErrorResponse);
    }
);

export default axiosInstance;