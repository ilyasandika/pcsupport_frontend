import {delay} from "../../helper/helper.tsx";
import type {IAssetCategory, ICreateAssetCategoryDto, IAssetCategoryRepository} from "@/types/asset-category.type.ts";
import api from "../api/interceptors.ts";


const assetCategoryLocal: IAssetCategoryRepository = {
    getAll: async (): Promise<IAssetCategory[]> => {
	await delay();
	console.log('masukLocal')
	return [] as IAssetCategory[];
    },
    getById: async (id: number | string): Promise<IAssetCategory> => {
	await delay();
	console.log('masukLocal', id)
	return {} as IAssetCategory;
    },
    create: async (payload: ICreateAssetCategoryDto): Promise<IAssetCategory> => {
	await delay();
	console.log('masukLocal', payload)
	return {} as IAssetCategory;
    },
    update: async (id: number | string, payload: ICreateAssetCategoryDto): Promise<IAssetCategory> => {
	await delay();
	console.log('masukLocal', id, payload)
	return {} as IAssetCategory;
    },
    remove: async (id: number | string) => {
	await delay();
	console.log('masukLocal', id)
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