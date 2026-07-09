import type {IDetailAssetAssignment} from "./asset-assignment.type.ts";
import type { ITicketForAsset} from "./ticket.type.ts";

export interface IDetailEmployee {
    nik: string;
    name: string;
    contractType: string;
    position: string;
    positionId: string;
    fs: string;
    mjl: string;
    bod: string;
    religion: string;
    directorate: string;
    division: string;
    department: string;
    status?: boolean;
    retireDate?: string | null | undefined;
    assetAssignments?: IDetailAssetAssignment[],
    tickets?: ITicketForAsset[],
    createdAt: string;
    updatedAt: string;
}

export type IEmployee = Pick<IDetailEmployee, 'nik' | 'name' | 'position' | 'department'>;


export interface IEmployeeRepository {
    getEmployees: () => Promise<IDetailEmployee[]>
    getEmployeeListForDropdown: () => Promise<IEmployee[]>
    getEmployeeDetail: (nik: string) => Promise<IDetailEmployee>
}
