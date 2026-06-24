export interface IAuth {
    username: string;
    fullName: string;
    email: string;
    role: string;
    token: string;
}

export interface IAuthRepository {
    login: (username: string, password: string) => Promise<IAuth>
}