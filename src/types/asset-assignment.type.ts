import type {AssetStatusType, IDetailAsset} from "./asset.type.ts";
import type {IDetailEmployee} from "./employee.type.ts";
import type {IUser} from "@/types/user.type.ts";
import type {IPrintTicketPayload} from "@/types/ticket.type.ts";

export interface IDetailAssetAssignment {
    id: number;
    assetId: number;
    asset: IDetailAsset
    employee: IDetailEmployee
    userNonEmployeeName?: string;
    assignedAt: string;
    returnedAt?: string;
    status: AssetStatusType;
    isBackup: boolean;
    backupForAssetTag?: string;
    isUnderMaintenance: boolean;
    createdBy: IUser;
    assignBy: IUser;
    assignFilePath?: string;
    returnFilePath?: string;
    remarks?: string;
    createdAt: string;
}

export type IAssetAssignment = Pick<IDetailAssetAssignment, 'id' >
export type IAssetAssignmentNoAsset = Omit<IDetailAssetAssignment, 'asset'>;
export type IAssetAssignmentNoEmployee = Omit<IDetailAssetAssignment, 'employee'>;

export interface ICreateAssetAssignmentPayload {
    assetTag: string;
    picEmployeeNik: string;
    userNonEmployeeName?: string;
    assignedAt: string;
    remarks?: string
    assignById: number;
    isBackup?: boolean;
    contact?: string;
    isLegacyData?: boolean;
}

export interface IReturnAssetAssignmentPayload {
    returnedAt: string;
    remarks?: string;
    engineerId: number;
}

export interface IGenerateAssetAssignmentPayload extends IPrintTicketPayload {
}

export interface IAssetAssignmentRepository {
    getAssetAssignmentsByAssetId: (assetId: number) => Promise<IDetailAssetAssignment[]>;
    getAssetAssignmentsByEmployeeId: (employeeId: number) => Promise<IDetailAssetAssignment[]>;
    create: (payload: ICreateAssetAssignmentPayload) => Promise<IDetailAssetAssignment>;
    returnAssignment: (
        id: number | string,
        payload: IReturnAssetAssignmentPayload,
    ) => Promise<IDetailAssetAssignment>;
    generateDocument: (
        id: number | string,
        payload: IGenerateAssetAssignmentPayload,
        type: 'assign' | 'return',
    ) => Promise<void>;
    uploadDocument: (
        id: number | string,
        file: File,
        type: 'assign' | 'return',
    ) => Promise<void>;
    viewDocument: (
        id: number | string,
        type: 'assign' | 'return',
    ) => Promise<void>;
}