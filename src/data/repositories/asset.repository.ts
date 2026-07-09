import type {IDetailAsset, IAssetRepository, IAssetSummary, IAsset} from "@/types/asset.type.ts";
import assetSummaryDummy from "../local/asset/asset-summary.data.json"
import assetDummies from "../local/asset/asset.data.json"
import {delay} from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";

const assetLocal: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	await delay();
	return assetSummaryDummy as IAssetSummary;
    },
    getAssets: async (): Promise<IDetailAsset[]> => {
	await delay();
	return assetDummies as unknown as IDetailAsset[]
    },
    getAssetBySn: async (serialNumber: string): Promise<IDetailAsset> => {
	await delay();
	// @ts-ignore
	return assetDummies.find((asset) => asset.serialNumber === serialNumber) as unknown as IDetailAsset
    },
    getAssetListForDropdown: async (): Promise<IAsset[]> => {
	return []
    }
}

const assetApi: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	const data = await api.get('/asset-categories/count')
	return data.data
    },
    getAssets: async (): Promise<IDetailAsset[]> => {
	const data = await api.get('assets')
	return data.data
    },
    getAssetBySn: async (serialNumber: string): Promise<IDetailAsset> => {
	const data = await api.get(`/assets/${serialNumber}`)
	return data.data
    },
    getAssetListForDropdown: async (): Promise<IAsset[]> => {
	const data = await api.get('assets/list')
	return data.data
    }
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetApi : assetLocal;
};

export const AssetRepository = createAssetRepository();
