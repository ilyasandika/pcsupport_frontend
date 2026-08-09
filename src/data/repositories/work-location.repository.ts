import {delay} from "../../helper/helper.tsx";
import type {IDetailWorkLocation, ICreateWorkLocationDto, IWorkLocationRepository} from "@/types/work-location.type.ts"
import api from "../api/interceptors.ts";


const workLocationLocal: IWorkLocationRepository = {
    getAll: async (): Promise<IDetailWorkLocation[]> => {
	await delay();
	console.log('masukLocal')
	return [] as IDetailWorkLocation[];
    },
    getById: async (id: number | string): Promise<IDetailWorkLocation> => {
	await delay();
	console.log('masukLocal', id)
	return {} as IDetailWorkLocation;
    },
    create: async (payload: ICreateWorkLocationDto): Promise<IDetailWorkLocation> => {
	await delay();
	console.log('masukLocal', payload)
	return {} as IDetailWorkLocation;
    },
    update: async (id: number | string, payload: ICreateWorkLocationDto): Promise<IDetailWorkLocation> => {
	await delay();
	console.log('masukLocal', id, payload)
	return {} as IDetailWorkLocation;
    },
    remove: async (id: number | string) => {
	await delay();
	console.log('masukLocal', id)
    }
}


const workLocationApi: IWorkLocationRepository = {
    getAll: async (): Promise<IDetailWorkLocation[]> => {
	const res = await api.get('/work-locations');
	return res.data;
    },
    getById: async (id: number | string): Promise<IDetailWorkLocation> => {
	const res = await api.get(`/work-locations/${id}`);
	return res.data;
    },
    create: async (payload: ICreateWorkLocationDto): Promise<IDetailWorkLocation> => {
	const res = await api.post('/work-locations', payload);
	return res.data;
    },
    update: async (id: number | string, payload: ICreateWorkLocationDto): Promise<IDetailWorkLocation> => {
	const res = await api.patch(`/work-locations/${id}`, payload);
	return res.data;
    },
    remove: async (id: number | string) => {
	return await api.delete(`/work-locations/${id}`);
    }
}


const createWorkLocationRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? workLocationApi : workLocationLocal;
};

export const WorkLocationRepository = createWorkLocationRepository();