import type {ITicketForAsset} from "./ticket.type.ts";
import type {IWorkLocation} from "@/types/work-location.types.ts";

export interface IDetailUser {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    active: boolean;
    tickets: ITicketForAsset[]
    workLocation: IWorkLocation
    createdAt: string;
    updatedAt: string;
}

export type IUser = Pick<IDetailUser, 'id' | 'username' | 'fullName' | 'role'>;


export interface IUserRepository {
    getUsers: () => Promise<IDetailUser[]>
    getUserById: (id: number) => Promise<IDetailUser>
    getEngineers: () => Promise<IDetailUser[]>

}