import type {IAsset, IAssetRepository, IAssetSummary} from "../../types/asset.type.ts";
import assetSummaryDummy from "../local/asset/asset-summary.data.json"
import assetDummies from "../local/asset/asset.data.json"
import {delay} from "../../helper/helper.tsx";
import axiosInstance from "../api/interceptors.ts";

const assetLocal: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	await delay();
	return assetSummaryDummy as IAssetSummary;
    },
    getAssets: async (): Promise<IAsset[]> => {
	await delay();
	return assetDummies as IAsset[]
    },
    getAssetById: async (assetId: number): Promise<IAsset> => {
	await delay();
	return assetDummies.find((asset) => asset.id === assetId) as IAsset
    }
}

const assetApi: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	const data = await axiosInstance.get('assets/count/category')
	return data.data
    },
    getAssets: async (): Promise<IAsset[]> => {
	return [] as IAsset[]
    },
    getAssetById: async (assetId: number): Promise<IAsset> => {
	console.log(assetId)
	return {} as IAsset
    }
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetApi : assetLocal;
};

export const AssetRepository = createAssetRepository();
