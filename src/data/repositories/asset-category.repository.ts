import {delay} from "../../helper/helper.tsx";
import type {IAssetCategory, ICreateAssetCategoryDto, IAssetCategoryRepository} from "@/types/asset-category.type.ts";
import api from "../api/interceptors.ts";


let mockAssetCategories: IAssetCategory[] = [
    { id: 1, name: 'Laptop & Notebook', description: 'Laptop and portable notebook computers assigned to staff' },
    { id: 2, name: 'PC Desktop', description: 'Desktop computers, towers, and workstations' },
    { id: 3, name: 'Printer & Scanner', description: 'Office printers, plotters, and document scanners' },
    { id: 4, name: 'Network Equipment', description: 'Routers, switches, access points, and network hardware' },
    { id: 5, name: 'Monitors & Displays', description: 'External monitors, dual-screen displays, and TVs' },
];

const assetCategoryLocal: IAssetCategoryRepository = {
    getAll: async (): Promise<IAssetCategory[]> => {
	await delay();
	return [...mockAssetCategories];
    },
    getById: async (id: number | string): Promise<IAssetCategory> => {
	await delay();
	const item = mockAssetCategories.find(c => String(c.id) === String(id));
	if (!item) throw new Error("Category not found");
	return { ...item };
    },
    create: async (payload: ICreateAssetCategoryDto): Promise<IAssetCategory> => {
	await delay();
	const newCategory: IAssetCategory = {
	    id: Date.now(),
	    name: payload.name,
	    description: payload.description || '',
	};
	mockAssetCategories.push(newCategory);
	return newCategory;
    },
    update: async (id: number | string, payload: ICreateAssetCategoryDto): Promise<IAssetCategory> => {
	await delay();
	const index = mockAssetCategories.findIndex(c => String(c.id) === String(id));
	if (index === -1) throw new Error("Category not found");
	mockAssetCategories[index] = {
	    ...mockAssetCategories[index],
	    name: payload.name,
	    description: payload.description || '',
	};
	return mockAssetCategories[index];
    },
    remove: async (id: number | string) => {
	await delay();
	mockAssetCategories = mockAssetCategories.filter(c => String(c.id) !== String(id));
    }
}



const assetCategoryApi: IAssetCategoryRepository = {
    getAll: async (): Promise<IAssetCategory[]> => {
	const res = await api.get('/asset-categories');
	return res.data;
    },
    getById: async (id: number | string): Promise<IAssetCategory> => {
	const res = await api.get(`/asset-categories/${id}`);
	return res.data;
    },
    create: async (payload: ICreateAssetCategoryDto): Promise<IAssetCategory> => {
	const res = await api.post('/asset-categories', payload);
	return res.data;
    },
    update: async (id: number | string, payload: ICreateAssetCategoryDto): Promise<IAssetCategory> => {
	const res = await api.patch(`/asset-categories/${id}`, payload);
	return res.data;
    },
    remove: async (id: number | string) => {
	return await api.delete(`/asset-categories/${id}`);
    }
}


const createAssetCategoryRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetCategoryApi : assetCategoryLocal;
};

export const AssetCategoryRepository = createAssetCategoryRepository();