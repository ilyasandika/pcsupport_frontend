import type {IDetailUser, IUserRepository, ICreateUserDTO, IUpdateUserDTO} from "@/types/user.type.ts";
import api from "../api/interceptors.ts";

const userApi: IUserRepository = {
    getUsers: async (): Promise<IDetailUser[]> => {
	const user = await api.get('users')
	return user.data
    },
    getUserById: async (id: number): Promise<IDetailUser> => {
	const res = await api.get(`users/${id}`)
	return res.data
    },
    getEngineers: async (): Promise<IDetailUser[]> => {
	const res = await api.get('users/engineers')
	return res.data
    },
    getSupervisors: async (): Promise<IDetailUser[]> => {
	const res = await api.get('users/supervisors')
	return res.data
    },
    createUser: async (data: ICreateUserDTO): Promise<void> => {
	const res = await api.post('users', data)
	return res.data
    },
    updateUser: async (id: number, data: IUpdateUserDTO): Promise<void> => {
	const res = await api.patch(`users/${id}`, data)
	return res.data
    },
    deleteUser: async (id: number): Promise<void> => {
	const res = await api.delete(`users/${id}`)
	return res.data
    },
    changePassword: async (id: number, oldPassword: string, newPassword: string) => {
	try {
	    const res = await api.patch(`users/password/${id}`, {
		oldPassword,
		newPassword
	    })
	    return res.data
	} catch (e) {
	    throw e
	}
    }
}

const createAssetRepository = () => {
    return userApi;
};

export const UserRepository = createAssetRepository();
