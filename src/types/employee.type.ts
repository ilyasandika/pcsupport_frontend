import type {IDetailAssetAssignment} from "./asset-assignment.type.ts";
import type { ITicketForAsset} from "./ticket.type.ts";
import type {IWorkLocation} from "@/types/work-location.type.ts";

export interface IDetailEmployee {
    nik: string;
    nik2?: string;
    name: string;
    position: string;
    positionId?: string;
    fs?: string;
    mjl?: string;
    bod?: string;
    religion?: string;
    directorate?: string;
    division?: string;
    department?: string;
    status?: string | null;
    retireDate?: string | null | undefined;
    workLocation: IWorkLocation;
    workLocationId?: number;
    assetAssignments?: IDetailAssetAssignment[];
    tickets?: ITicketForAsset[];
    createdAt: string;
    updatedAt: string;
}

export interface ICreateEmployeeDto {
    nik: string;
    nik2?: string;
    name: string;
    position?: string;
    positionId?: string;
    fs?: string;
    mjl?: string;
    bod?: string;
    religion?: string;
    directorate?: string;
    division?: string;
    department?: string;
    workLocationId: number;
    status?: string | null;
    retireDate?: string | null;
}

export type IUpdateEmployeeDto = Partial<ICreateEmployeeDto>;

export type IEmployee = Pick<IDetailEmployee, 'nik' | 'name' | 'position' | 'department' |'workLocation' >;

export interface IEmployeeRepository {
    getEmployees: () => Promise<IDetailEmployee[]>;
    getEmployeeListForDropdown: () => Promise<IEmployee[]>;
    getEmployeeByNik: (nik: string) => Promise<IDetailEmployee>;
    importEmployees: (file: File) => Promise<void>;
    createEmployee: (dto: ICreateEmployeeDto) => Promise<IDetailEmployee>;
    updateEmployee: (nik: string, dto: IUpdateEmployeeDto) => Promise<IDetailEmployee>;
    deleteEmployee: (nik: string) => Promise<void>;
}

