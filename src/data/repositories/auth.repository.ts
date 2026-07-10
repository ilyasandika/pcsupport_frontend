import {delay} from "../../helper/helper.tsx";
import type {IAuth, IAuthRepository} from "@/types/auth.type.ts";
import api from "../api/interceptors.ts";


const authLocal: IAuthRepository = {
    login: async (): Promise<IAuth> => {
	await delay();
	console.log('masukLocal')
	return {} as IAuth;
    },
    logout: async () => {
	await delay();
    }
}


const authApi: IAuthRepository = {
    login: async (username: string, password: string): Promise<IAuth> => {
	const res = await api.post('/auth/login', {
	    username,
	    password,
	})
	return res.data;
    },
    logout: async () => {
	return await api.post('/auth/logout')
    }
}


const createAuthRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? authApi : authLocal;
};

export const AuthRepository = createAuthRepository();
