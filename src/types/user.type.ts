export interface IUser {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface IUserRepository {
    getUsers: () => Promise<IUser[]>

}