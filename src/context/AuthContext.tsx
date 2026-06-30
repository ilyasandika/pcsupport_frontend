import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import api from "../data/api/interceptors.ts";
import {AuthRepository} from "../data/repositories/auth.repository.ts";
import type {IAuth} from "../types/auth.type.ts";

interface AuthContextType {
    user: IAuth | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IAuth | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
	checkAuth();
    }, []);

    const checkAuth = async () => {
	try {
	    const res = await api.get('/auth/me');
	    setUser(res.data);
	} catch (err) {
	    setUser(null);
	} finally {
	    setIsLoading(false);
	}
    };

    const login = async (username: string, password: string) => {
	await AuthRepository.login(username, password).then(data => {
	    setUser(data);
	}).catch(err => {
	    return err;
	})
    };

    const logout = async () => {
	AuthRepository.logout();
	setUser(null);
    };

    return (
	<AuthContext.Provider value={{ user, isLoading, login, logout }}>
	    {children}
	</AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
	throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}