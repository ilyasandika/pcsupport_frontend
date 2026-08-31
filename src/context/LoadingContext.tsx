import { createContext, type ReactNode, useContext, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface LoadingContextType {
	isLoading: boolean;
	title?: string;
	description?: string;
	isAi?: boolean;
	setIsLoading: (isLoading: boolean) => void;
	showLoading: (title?: string, description?: string, isAi?: boolean) => void;
	hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState<string | undefined>();
	const [description, setDescription] = useState<string | undefined>();
	const [isAi, setIsAi] = useState<boolean>(false);

	const showLoading = (customTitle?: string, customDescription?: string, aiMode: boolean = true) => {
		setTitle(customTitle || "Memproses...");
		setDescription(customDescription || "Mohon tunggu sebentar, sistem sedang memproses permintaan Anda.");
		setIsAi(aiMode);
		setIsLoading(true);
	};

	const hideLoading = () => {
		setIsLoading(false);
		setTitle(undefined);
		setDescription(undefined);
		setIsAi(false);
	};

	const handleSetIsLoading = (loading: boolean) => {
		if (loading) {
			showLoading();
		} else {
			hideLoading();
		}
	};

	return (
		<LoadingContext.Provider
			value={{
				isLoading,
				title,
				description,
				isAi,
				setIsLoading: handleSetIsLoading,
				showLoading,
				hideLoading,
			}}
		>
			{children}
			{isLoading && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
					<div className="relative w-full max-w-sm mx-4 bg-white/95 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl p-7 text-center flex flex-col items-center gap-5 overflow-hidden">
						{/* Background Glowing Blobs */}
						<div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/25 rounded-full blur-2xl animate-pulse" />
						<div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/25 rounded-full blur-2xl animate-pulse delay-700" />

						{/* Center Animated Icon Orb */}
						<div className="relative flex items-center justify-center my-2">
							<div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 border-r-indigo-600 animate-spin" />
							<div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
								{isAi ? (
									<Sparkles className="w-5 h-5 animate-pulse" />
								) : (
									<Loader2 className="w-5 h-5 animate-spin" />
								)}
							</div>
						</div>

						{/* Title & Description */}
						<div className="space-y-1.5 z-10">
							<h3 className="text-base font-bold text-slate-800 tracking-tight">
								{title || "Memproses Data..."}
							</h3>
							<p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
								{description || "Mohon tunggu sebentar, sistem sedang memproses..."}
							</p>
						</div>

						{/* Shimmer Bar Indicator */}
						<div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
							<div className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-full w-full animate-pulse" />
						</div>
					</div>
				</div>
			)}
		</LoadingContext.Provider>
	);
};

export function useLoading() {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error("useLoading harus digunakan di dalam LoadingProvider");
	}
	return context;
}