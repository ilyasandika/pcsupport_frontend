import type {ITicketForAsset} from "./ticket.type.ts";
import type {IWorkLocation} from "@/types/work-location.type.ts";

export interface IDetailUser {
    id: number;
    username: string;
    fullName: string;
    email: string;
    nik?: string;
    role: string;
    active: boolean;
    signaturePath?: string;
    tickets?: ITicketForAsset[]
    workLocation: IWorkLocation
    createdAt: string;
    updatedAt: string;
}

export type IUser = Pick<IDetailUser, 'id' | 'username' | 'fullName' | 'role' | 'nik' | 'workLocation'>;

export interface ICreateUserDTO {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    workLocationId: number;
}

export interface IUpdateUserDTO {
    username: string;
    fullName: string;
    email: string;
    role: string;
    workLocationId: number;
}

export interface IUserRepository {
    getUsers: () => Promise<IDetailUser[]>
    getUserById: (id: number) => Promise<IDetailUser>
    getEngineers: () => Promise<IDetailUser[]>
    getSupervisors: () => Promise<IDetailUser[]>
    createUser: (data: ICreateUserDTO) => Promise<void>
    updateUser: (id: number, data: IUpdateUserDTO) => Promise<void>
    deleteUser: (id: number) => Promise<void>
    changePassword: (id: number, oldPassword: string, newPassword: string) => Promise<void>
    uploadSignature: (id: number, file: File) => Promise<void>
    viewSignature: (id: number) => Promise<void>
}