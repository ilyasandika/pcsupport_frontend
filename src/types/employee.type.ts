import type {IAssetAssignment} from "./asset-assignment.type.ts";
import type {ITicket} from "./ticket.type.ts";

export interface IEmployee {
    id: number;
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
    assetAssignments?: IAssetAssignment[],
    tickets?: ITicket[],
    createdAt: string;
    updatedAt: string;
}

export interface IEmployeeRepository {
    getEmployees: () => Promise<IEmployee[]>
    getEmployeeDetail: (employeeId: number) => Promise<IEmployee>
}
