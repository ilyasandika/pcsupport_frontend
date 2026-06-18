export interface IUser {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface IUserRepository {
    getUsers: () => Promise<IUser[]>

}