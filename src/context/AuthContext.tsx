import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import api from "../data/api/interceptors.ts";
import {AuthRepository} from "../data/repositories/auth.repository.ts";
import type {IAuth} from "../types/auth.type.ts";
import {useLoading} from "@/context/LoadingContext.tsx";

interface AuthContextType {
    user: IAuth | null;
    isLoading: boolean;
    isAdmin: () => boolean;
    isHelpdesk: () => boolean;
    isEngineer: () => boolean;
    isSupervisor: () => boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IAuth | null>(null);
    const {isLoading, setIsLoading} = useLoading();

    useEffect(() => {
	checkAuth();
    }, []);

    const checkAuth = async () => {
	try {
	    setIsLoading(true);
	    const res = await api.get('/auth/me');
	    setUser(res?.data || res);
	} catch (err) {
	    setUser(null);
	} finally {
	    setIsLoading(false);
	}
    };


    const login = async (username: string, password: string) => {
	await AuthRepository.login(username, password).then(data => {
	    setUser(data);
	    return data
	})
    };

    const isAdmin = () => {
	return user?.role === 'admin';
    }

    const isHelpdesk = () => {
	return user?.role === 'helpdesk';
    }

    const isEngineer = () => {
	return user?.role === 'engineer';
    }

    const isSupervisor = () => {
	return user?.role === 'supervisor';
    }

    const logout = async () => {
	AuthRepository.logout();
	setUser(null);
    };

    return (
	<AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, isHelpdesk, isEngineer, isSupervisor}}>
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