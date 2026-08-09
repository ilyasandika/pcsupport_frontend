import {delay} from "../../helper/helper.tsx";
import type {ISlaPolicy, ISlaPolicyPayload, ISlaPolicyRepository} from "@/types/sla.type.ts";
import api from "../api/interceptors.ts";


const slaPolicyLocal: ISlaPolicyRepository = {
    getAll: async (): Promise<ISlaPolicy[]> => {
	await delay();
	console.log('masukLocal')
	return [] as ISlaPolicy[];
    },
    getById: async (id: number | string): Promise<ISlaPolicy> => {
	await delay();
	console.log('masukLocal', id)
	return {} as ISlaPolicy;
    },
    create: async (payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	await delay();
	console.log('masukLocal', payload)
	return {} as ISlaPolicy;
    },
    update: async (id: number | string, payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	await delay();
	console.log('masukLocal', id, payload)
	return {} as ISlaPolicy;
    },
    remove: async (id: number | string) => {
	await delay();
	console.log('masukLocal', id)
    }
}


const slaPolicyApi: ISlaPolicyRepository = {
    getAll: async (): Promise<ISlaPolicy[]> => {
	const res = await api.get('/sla-policies');
	return res.data;
    },
    getById: async (id: number | string): Promise<ISlaPolicy> => {
	const res = await api.get(`/sla-policies/${id}`);
	return res.data;
    },
    create: async (payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	const res = await api.post('/sla-policies', payload);
	return res.data;
    },
    update: async (id: number | string, payload: ISlaPolicyPayload): Promise<ISlaPolicy> => {
	const res = await api.patch(`/sla-policies/${id}`, payload);
	return res.data;
    },
    remove: async (id: number | string) => {
	return await api.delete(`/sla-policies/${id}`);
    }
}


const createSlaPolicyRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? slaPolicyApi : slaPolicyLocal;
};

export const SlaPolicyRepository = createSlaPolicyRepository();