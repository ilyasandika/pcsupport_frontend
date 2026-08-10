import type {
    IDetailAsset,
    IAssetRepository,
    IAssetSummary,
    IAsset,
    IAssetPayload,
    IAssetFilter
} from "@/types/asset.type.ts";
import api from "../api/interceptors.ts";
import type { ISuccessResponse } from "@/types/api.type.ts";

const assetApi: IAssetRepository = {
    getAssetSummary: async (): Promise<IAssetSummary> => {
        const data = await api.get('/asset-categories/count')
        return data.data
    },
    getAssets: async (filter?: IAssetFilter): Promise<ISuccessResponse<IAsset[]>> => {
        console.log(filter)
        return await api.get('assets', {
            params: filter,
            paramsSerializer: {
                indexes: null
            }
        })

    },
    getBackupAssets: async (): Promise<IAsset[]> => {
        const data = await api.get('assets/list/backup')
        return data.data
    },
    getAssetsByEmployeeNik: async (nik: string): Promise<IAsset[]> => {
        const data = await api.get(`/assets/employee/${nik}`)
        return data.data
    },
    getAssetBySn: async (assetTag: string): Promise<IDetailAsset> => {
        const data = await api.get(`/assets/${assetTag}`)
        return data.data
    },
    getActiveAssetList: async (): Promise<IAsset[]> => {
        const data = await api.get('assets/list/active')
        return data.data
    },
    createAsset: async (payload: IAssetPayload): Promise<IDetailAsset> => {
        const res = await api.post('/assets', payload);
        return res.data;
    },
    updateAsset: async (payload: IAssetPayload): Promise<IDetailAsset> => {
        const res = await api.patch(`/assets/${payload.assetTag}`, payload);
        return res.data;
    },
}


const createAssetRepository = () => {
    return assetApi
};

export const AssetRepository = createAssetRepository();
