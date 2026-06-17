import type {IAsset, IAssetRepository, IAssetSummary} from "../../types/asset.type.ts";
import assetSummaryDummy from "../local/asset/asset-summary.data.json"
import assetDummy from "../local/asset/asset.data.json"

const assetLocal: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	return assetSummaryDummy as IAssetSummary;
    },
    getAssets: async (): Promise<IAsset[]> => {
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
