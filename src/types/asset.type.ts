import type { ITicketForAsset } from "./ticket.type.ts";
import type { IDetailAssetAssignment } from "./asset-assignment.type.ts";
import type { IWorkLocation } from "@/types/work-location.type.ts";
import type { ISuccessResponse } from "@/types/api.type.ts";

export interface IAssetPayload {
    serialNumber?: string;
    assetTag: string;
    hostname: string;
    brand: string;
    model?: string;
    processor?: string;
    storageType?: string;
    storageCapacityByte?: number;
    memoryType?: string;
    memoryCapacityByte?: number;
    warrantyDate?: string;
    purchaseDate?: string;
    categoryId: number;
    projectId: number;
    status?: AssetStatusType;
}

export interface IAssetRepository {
    getAssetSummary: () => Promise<IAssetSummary>
    getAssets: (filter?: IAssetFilter) => Promise<ISuccessResponse<IAsset[]>>
    getBackupAssets: () => Promise<IAsset[]>
    getAssetBySn: (assetTag: string) => Promise<IDetailAsset>
    getActiveAssetList: () => Promise<IAsset[]>
    createAsset: (payload: IAssetPayload) => Promise<IDetailAsset>;
    updateAsset: (payload: IAssetPayload) => Promise<IDetailAsset>;
}

export interface IDetailAsset {
    serialNumber: string;
    assetTag: string;
    status: AssetStatusType;
    hostname: string;
    category: {
        id: number;
        name: string;
    }
    type: string;
    // brand: string;
    // model?: string;
    warrantyDate?: string;
    purchaseDate?: string;
    storageType?: string;
    storageCapacityByte?: number;
    memoryType?: string;
    memoryCapacityByte?: number;
    processor?: string;
    assetAssignments?: IDetailAssetAssignment[];
    assetAssignment?: IDetailAssetAssignment;
    workLocation: IWorkLocation;
    supports: IAssetSupport[]
    project: {
        id: number;
        name: string;
        vendor: {
            id: number;
            name: string;
        }
    }
    tickets: ITicketForAsset[];
    createdAt: string;
}

export type IAsset = Pick<IDetailAsset,
    'serialNumber' |
    'assetTag' |
    'status' |
    'hostname' |
    'type' |
    'category' |
    'project' |
    'assetAssignment' |
    'workLocation'
>;

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

export const AssetStatus = {
    Assigned: 'assigned',
    AssignedForBackup: 'assigned for backup',
    ReadyStock: 'ready stock',
    Undeployed: 'undeployed',
    PendingBAST: 'pending bast',
    Damaged: 'damaged',
    Offline: 'offline',
    Returned: 'returned',
    Missing: 'missing',
    Backup: 'backup',
    Unknown: 'unknown',
} as const;

export type AssetStatusType = typeof AssetStatus[keyof typeof AssetStatus];

const { Assigned, Returned, AssignedForBackup, ...AllowedStatusChange } = AssetStatus;

export { AllowedStatusChange };

export interface IAssetFilter {
    status?: string[];
    asset?: string;
    assetTag?: string;
    assetSn?: string;
    hostname?: string;
    employee?: string;
    employeeName?: string;
    employeeNik?: string;
    category?: string[];
    type?: string;
    vendorProject?: string;
    vendor?: string;
    project?: string;
    page?: number;
    limit?: number;
}

