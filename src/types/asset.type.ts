import type {ITicketForAsset} from "./ticket.type.ts";

export interface IAssetRepository {
    getAssetSummary: () => Promise<IAssetSummary>
    getAssets: () => Promise<IDetailAsset[]>
    getAssetById: (assetId: number) => Promise<IDetailAsset>
}

export interface IDetailAsset {
    id: number;
    serialNumber: number;
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
    assetAssignments?: IAssetAssignment[];
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

export interface IAsset {
    id: number;
    serialNumber: string;
    assetTag: string;
    hostname: string;
    category: {
        id?: number
        name: string;
    }
    assetAssignment: IAssetAssignment
}

export interface IAssetAssignment {
    employee: {
        id: number,
        name: string,
        nik: string,
        position: string;
        department: string;
    }
    assignedAt: string;
    returnedAt?: string;
    remarks?: string;
    userNonEmployeeName?: string,
}

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
