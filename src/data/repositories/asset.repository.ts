import type {IAsset, IAssetRepository, IAssetSummary} from "../../types/asset.type.ts";
import assetSummaryDummy from "../local/asset/asset-summary.data.json"
import assetDummy from "../local/asset/asset.data.json"
import {delay} from "../../helper/helper.tsx";

const assetLocal: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	await delay();
	return assetSummaryDummy as IAssetSummary;
    },
    getAssets: async (): Promise<IAsset[]> => {
	await delay();
	return assetDummy as IAsset[]
    }
}


const assetApi: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	return {} as IAssetSummary;
    },
    getAssets: async (): Promise<IAsset[]> => {
	return [] as IAsset[]
    }
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetApi : assetLocal;
};

export const AssetRepository = createAssetRepository();
