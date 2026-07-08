import {delay} from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";
import type {IDetailWorkLocation, IWorkLocationRepository} from "@/types/work-location.types.ts";


const workLocationLocal: IWorkLocationRepository = {
    getLocations: async (): Promise<IDetailWorkLocation[]> => {
	await delay();
	return [];
    },
}


const workLocationApi: IWorkLocationRepository = {
    getLocations: async (): Promise<IDetailWorkLocation[]> => {
	const user = await api.get('work-locations')
	return user.data
    },
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? workLocationApi : workLocationLocal;
};

export const WorkLocationRepository = createAssetRepository();
