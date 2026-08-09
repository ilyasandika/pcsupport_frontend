import axios from 'axios';
import type {IErrorResponse} from "@/types/api.type.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
	// 'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
	const contentType = response.headers["content-type"]
	if (contentType && typeof contentType === "object" && contentType.includes("application/pdf")) {
	    return response
	} else if (contentType && contentType === "application/pdf"){
	    return response
	}
	return response.data
    },
    async (error) => {
	if (error.response && error.response.status === 401 && window.location.pathname !== '/login') {
	    window.location.href = '/login';
	}
	if (error instanceof Blob) {
	    const errorText = await error.text();
	    console.log('Error text:', errorText);
	    return Promise.reject(JSON.parse(errorText) as IErrorResponse);
	}
	return Promise.reject(error.response.data as IErrorResponse);
    }
);

export default api;