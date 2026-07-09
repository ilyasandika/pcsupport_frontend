import type {ITicketForAsset} from "./ticket.type.ts";
import type { IDetailAssetAssignment} from "./asset-assignment.type.ts";

export interface IAssetRepository {
    getAssetSummary: () => Promise<IAssetSummary>
    getAssets: () => Promise<IDetailAsset[]>
    getAssetBySn: (serialNumber: string) => Promise<IDetailAsset>
    getAssetListForDropdown: () => Promise<IAsset[]>
}

export interface IDetailAsset {
    serialNumber: string;
    assetTag: string;
    hostname: string;
    category: {
        id: number;
        name: string;
    }
    brand: string;
    model?: string;
    warrantyDate?: string;
    purchaseDate?: string;
    storageType?: string;
    storageCapacityByte?: number;
    memoryType?: string;
    memoryCapacityByte?: number;
    processor?: string;
    assetAssignments?: IDetailAssetAssignment[];
    assetAssigment?: IDetailAssetAssignment;
    workLocation: {
        id: number;
        name: string;
    }
    supports: IAssetSupport[]
    project: {
        name: string;
        vendor: {
            id: number;
            name: string;
        }
    }
    tickets :ITicketForAsset[];
    createdAt: string;
}

export type IAsset = Pick<IDetailAsset, 'serialNumber' | 'assetTag' | 'hostname' | 'brand' | 'model' | 'category' | 'assetAssigment'>;

export interface IAssetSummary {
    nb: number;
    mws: number;
    pc: number;
    ws: number;
}

export interface IAssetSupport {
    id: number,
    name: string,
    type: string;
}
