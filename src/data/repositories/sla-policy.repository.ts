import {delay} from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";
import type {ISlaPolicy, ISlaPolicyRepository} from "@/types/sla.type.ts";


const slaLocal: ISlaPolicyRepository = {
    getSlaPolicies: async (): Promise<ISlaPolicy[]> => {
	await delay();
	return [];
    },
}

const slaApi: ISlaPolicyRepository = {
    getSlaPolicies: async (): Promise<ISlaPolicy[]> => {
	const user = await api.get('sla-policies')
	return user.data
    },
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? slaApi : slaLocal;
};

export const SlaPolicyRepository = createAssetRepository();
