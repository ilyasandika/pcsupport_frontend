import type {ITicketForAsset} from "./ticket.type.ts";

export interface IUser {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    active: boolean;
    tickets: ITicketForAsset[]
    createdAt: string;
    updatedAt: string;
}


export interface IUserRepository {
    getUsers: () => Promise<IUser[]>
    getUserById: (id: number) => Promise<IUser>

}