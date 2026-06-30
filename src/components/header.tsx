import { useState, useRef, useEffect } from "react";
import { Bell, Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import {useNavigate} from "react-router";

export const Header = () => {
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    // State untuk mengontrol tampilan dropdown profil
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Ref untuk mendeteksi klik di luar dropdown agar dropdown otomatis tertutup
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Efek untuk menutup dropdown saat pengguna mengklik area di luar dropdown
    useEffect(() => {
	const handleClickOutside = (event: MouseEvent) => {
	    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
		setIsProfileOpen(false);
	    }
	};
	document.addEventListener("mousedown", handleClickOutside);
	return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mengambil inisial nama depan dan belakang (Contoh: John Doe -> JD)
    const getInitials = (name: string) => {
	if (!name) return "AD";
	const parts = name.split(" ");
	return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
	<header className="lg:sticky lg:top-0 z-40 w-full bg-white border-b border-gray-200 h-18 px-8 flex items-center">
	    <div className="flex items-center justify-between w-full">
		<div className="flex items-center gap-3">
		    {/* Mobile Menu Button */}
		    <button
			className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
		    >
			<Menu className="w-6 h-6 text-gray-600" />
		    </button>
		    <div>
			<h2 className="text-md sm:text-lg font-bold text-gray-900">Dashboard</h2>
			<p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Welcome back, {user?.fullName}</p>
		    </div>
		</div>

		<div className="flex items-center gap-2 sm:gap-4">
		    {/* Notification Button */}
		    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
			<Bell className="w-5 h-5" />
			<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
		    </button>

		    {/* Profile Dropdown Container */}
		    <div className="relative" ref={dropdownRef}>
			<button
			    onClick={() => setIsProfileOpen(!isProfileOpen)}
			    className="flex cursor-pointer items-center gap-2 px-2 sm:px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
			>
			    <div className="w-8 h-8 cursor-pointer bg-ptba-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
				{user?.fullName ? getInitials(user.fullName) : "AD"}
			    </div>
			    <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user?.fullName}</span>
			</button>

			{/* Dropdown Menu */}
			{isProfileOpen && (
			    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
				<div className="px-4 py-2 border-b border-gray-100 sm:hidden">
				    <p className="text-xs text-gray-500">Logged in as</p>
				    <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
				</div>
				<button
				    onClick={() => {
					setIsProfileOpen(false);
					logout().then(()=> navigate('/login', { replace: true }));
				    }}
				    className="w-full cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors text-left"
				>
				    <LogOut className="w-4 h-4" />
				    <span>Log out</span>
				</button>
			    </div>
			)}
		    </div>
		</div>
	    </div>
	</header>
    )
}