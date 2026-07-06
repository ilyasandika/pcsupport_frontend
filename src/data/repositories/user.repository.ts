import type {IUser, IUserRepository} from "../../types/user.type.ts";
import userDummy from "../local/user/user.data.json"
import {delay} from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";


const userLocal: IUserRepository = {
    getUsers: async (): Promise<IUser[]> => {
	await delay();
	return userDummy as unknown as IUser[];
    },
    getUserById: async (id: number): Promise<IUser> => {
	console.log(id)
	await delay();
	return {} as IUser;
    }
}


const userApi: IUserRepository = {
    getUsers: async (): Promise<IUser[]> => {
	const user = await api.get('users')
	return user.data
    },
    getUserById: async (id: number): Promise<IUser> => {
	const res = await api.get(`users/${id}`)
	return res.data
    }

}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? userApi : userLocal;
};

export const UserRepository = createAssetRepository();
