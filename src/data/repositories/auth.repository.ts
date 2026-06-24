import {delay} from "../../helper/helper.tsx";
import type {IAuth, IAuthRepository} from "../../types/auth.type.ts";
import axiosInstance from "../api/interceptors.ts";


const authLocal: IAuthRepository = {
    login: async (): Promise<IAuth> => {
	await delay();
	console.log('masukLocal')
	return {} as IAuth;
    }
}


const authApi: IAuthRepository = {
    login: async (username: string, password: string): Promise<IAuth> => {
	await axiosInstance.post('/auth/login', {
	    username,
	    password,
	}).then(res => {
	    localStorage.setItem('token', res.data.token)
	    localStorage.setItem('user', res.data.user)
	    localStorage.setItem('role', res.data.role)
	    localStorage.setItem('username', res.data.username)
	    localStorage.setItem('fullName', res.data.fullName)
	})

	return {} as IAuth;
    }
}


const createAuthRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? authApi : authLocal;
};

export const AuthRepository = createAuthRepository();
