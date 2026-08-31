import {delay} from "../../helper/helper.tsx";
import type {IDetailWorkLocation, ICreateWorkLocationDto, IWorkLocationRepository} from "@/types/work-location.type.ts"
import api from "../api/interceptors.ts";

let mockWorkLocations: IDetailWorkLocation[] = [
    {
        id: 1,
        name: "Kantor Pusat Tanjung Enim",
        description: "Head Office PT Bukit Asam Tbk",
        address: "Jl. BUMN No. 1 Tanjung Enim, Sumatera Selatan",
        latitude: -3.714289,
        longitude: 103.791550,
    },
    {
        id: 2,
        name: "Kantor Perwakilan Jakarta",
        description: "Jakarta Representative Office",
        address: "Menara Kadin Indonesia Lt. 15, Jl. H.R. Rasuna Said, Jakarta Selatan",
        latitude: -6.225301,
        longitude: 106.832442,
    },
    {
        id: 3,
        name: "Unit Pelabuhan Tarahan",
        description: "Tarahan Port Operational Office",
        address: "Jl. Soekarno-Hatta Km. 15 Tarahan, Bandar Lampung",
        latitude: -5.485120,
        longitude: 105.340912,
    },
    {
        id: 4,
        name: "Dermaga Kertapati",
        description: "Kertapati Dock Office",
        address: "Jl. Stasiun Kertapati, Palembang, Sumatera Selatan",
        latitude: -3.008450,
        longitude: 104.743120,
    },
];

const workLocationLocal: IWorkLocationRepository = {
    getAll: async (): Promise<IDetailWorkLocation[]> => {
	await delay();
	return [...mockWorkLocations];
    },
    getById: async (id: number | string): Promise<IDetailWorkLocation> => {
	await delay();
	const item = mockWorkLocations.find(w => String(w.id) === String(id));
	if (!item) throw new Error(`Work Location with id ${id} not found`);
	return { ...item };
    },
    create: async (payload: ICreateWorkLocationDto): Promise<IDetailWorkLocation> => {
	await delay();
	const newLocation: IDetailWorkLocation = {
	    id: Date.now(),
	    name: payload.name,
	    description: payload.description || '',
	    address: payload.address || '',
	    latitude: Number(payload.latitude) || 0,
	    longitude: Number(payload.longitude) || 0,
	};
	mockWorkLocations.push(newLocation);
	return { ...newLocation };
    },
    update: async (id: number | string, payload: ICreateWorkLocationDto): Promise<IDetailWorkLocation> => {
	await delay();
	const index = mockWorkLocations.findIndex(w => String(w.id) === String(id));
	if (index === -1) throw new Error(`Work Location with id ${id} not found`);
	mockWorkLocations[index] = {
	    ...mockWorkLocations[index],
	    name: payload.name,
	    description: payload.description,
	    address: payload.address,
	    latitude: Number(payload.latitude),
	    longitude: Number(payload.longitude),
	};
	return { ...mockWorkLocations[index] };
    },
    remove: async (id: number | string) => {
	await delay();
	mockWorkLocations = mockWorkLocations.filter(w => String(w.id) !== String(id));
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