import type {IDetailAsset, IAssetRepository, IAssetSummary} from "../../types/asset.type.ts";
import assetSummaryDummy from "../local/asset/asset-summary.data.json"
import assetDummies from "../local/asset/asset.data.json"
import {delay} from "../../helper/helper.tsx";
import axiosInstance from "../api/interceptors.ts";

const assetLocal: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	await delay();
	return assetSummaryDummy as IAssetSummary;
    },
    getAssets: async (): Promise<IDetailAsset[]> => {
	await delay();
	return assetDummies as unknown as IDetailAsset[]
    },
    getAssetById: async (assetId: number): Promise<IDetailAsset> => {
	await delay();
	return assetDummies.find((asset) => asset.id === assetId) as unknown as IDetailAsset
    }
}

const assetApi: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	const data = await axiosInstance.get('/asset-categories/count')
	return data.data
    },
    getAssets: async (): Promise<IDetailAsset[]> => {
	const data = await axiosInstance.get('assets')
	return data.data
    },
    getAssetById: async (assetId: number): Promise<IDetailAsset> => {
	console.log(assetId)
	return {} as IDetailAsset
    }
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetApi : assetLocal;
};

export const AssetRepository = createAssetRepository();
