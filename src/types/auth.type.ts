export interface IAuth {
    id: number;
    username: string;
    fullName: string;
    email?: string;
    role: string;
}

export interface IAuthRepository {
    login: (username: string, password: string) => Promise<IAuth>
    logout: () => void
}