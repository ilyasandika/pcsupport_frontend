import type {IAsset} from "./asset.type.ts";
import type {IEmployee} from "./employee.type.ts";

export interface IAssetAssignment {
    id: number;
    assetId: number;
    asset?: IAsset
    picEmployeeId: number;
    picEmployee?: IEmployee
    userNonEmployeeName?: string;
    assignedAt: string;
    returnedAt?: string;
    status: string;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    isLegacyData: boolean;
}

export interface IAssetAssignmentRepository {
    getAssetAssignmentsByAssetId: (assetId: number) => Promise<IAssetAssignment[]>;
    getAssetAssignmentsByEmployeeId: (employeeId: number) => Promise<IAssetAssignment[]>;
}