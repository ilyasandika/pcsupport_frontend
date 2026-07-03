import type {IDetailAsset} from "./asset.type.ts";
import type {IEmployee} from "./employee.type.ts";

export interface IDetailAssetAssignment {
    id: number;
    assetId: number;
    asset: IDetailAsset
    employee: IEmployee
    userNonEmployeeName?: string;
    assignedAt: string;
    returnedAt?: string;
    status: string;
    remarks?: string;
    createdAt: string;
}

export type IAssetAssignmentNoAsset = Omit<IDetailAssetAssignment, 'asset'>;
export type IAssetAssignmentNoEmployee = Omit<IDetailAssetAssignment, 'employee'>;


export interface IAssetAssignmentRepository {
    getAssetAssignmentsByAssetId: (assetId: number) => Promise<IDetailAssetAssignment[]>;
    getAssetAssignmentsByEmployeeId: (employeeId: number) => Promise<IDetailAssetAssignment[]>;
}