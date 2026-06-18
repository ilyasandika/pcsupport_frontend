import type {IUser, IUserRepository} from "../../types/user.type.ts";
import userDummy from "../local/user/user.data.json"
import {delay} from "../../helper/helper.tsx";


const userLocal: IUserRepository = {
    getUsers: async (): Promise<IUser[]> => {
	await delay();
	return userDummy as IUser[];
    }
}


const userApi: IUserRepository = {
    getUsers: async (): Promise<IUser[]> => {
	return [] as IUser[]; ///todo
    }
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? userApi : userLocal;
};

export const UserRepository = createAssetRepository();
