import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext"; // Sesuaikan path import

export const RequireAuth = () => {
    const { user } = useAuth();

    if (!user) {
	// Jika belum login, lempar ke halaman login
	return <Navigate to="/login" replace />;
    }

    // Jika sudah login, render anak-anaknya (Outlet)
    return <Outlet />;
};

export const RequireAdmin = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin()) {
	// Jika bukan admin, lempar ke dashboard atau halaman 403 (Unauthorized)
	return <Navigate to="/" replace />;
    }

    return <Outlet />;
};