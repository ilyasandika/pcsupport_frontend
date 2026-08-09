// 1. Setup Context
import {createContext, type ReactNode, useContext, useState} from "react";


interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children } : {children: ReactNode}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
	<LoadingContext.Provider value={{ isLoading ,setIsLoading }}>
	    {children}
	    {isLoading && (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
		</div>
	    )}
	</LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
	throw new Error("useLaoding harus digunakan di dalam LoadingProvider");
    }
    return context;
}