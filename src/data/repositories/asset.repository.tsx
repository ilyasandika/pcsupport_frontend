import type {IAssetRepository, IAssetSummary} from "../../types/asset.type.ts";
import assetSummaryDummy from "../local/asset/asset-summary.data.json"

const assetLocal: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	return assetSummaryDummy as IAssetSummary;
    }
}


const assetApi: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
	return {} as IAssetSummary;
    }
}


const createAssetRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetApi : assetLocal;
};

export const AssetRepository = createAssetRepository();
