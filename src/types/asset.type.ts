export interface IAssetSummary {
    nb: number;
    mws: number;
    pc: number;
    ws: number;
}

export interface IAssetRepository {
    getAssetSummary: () => Promise<IAssetSummary>
    getAssets: () => Promise<IAsset[]>
}


export interface IAsset {
    id: number;
    serialNumber: number;
    assetTag: string;
    hostname: string;
    user?: {
        employeeId: number,
        nik: string,
        name: string,
        userNonEmployee?: string,
    }
    category: 'nb' | 'mws' | 'ws' | 'pc';
    brand: string;
    model?: string;
    workLocation: {
        id: number;
        name: string;
    }
    project: {
        name: string;
        vendor: {
            id: number;
            name: string;
        }
    }
    warrantyDate?: string;
    purchaseDate?: string;
    storageType?: string;
    storageCapacityByte?: number;
    memoryType?: string;
    memoryCapacityByte?: string;
    processor?: string;
    createdAt: string;
    updatedAt: string;
}