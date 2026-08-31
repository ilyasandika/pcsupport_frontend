import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext"; // Sesuaikan path import

export const RequireAuth = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) {
        // Jika belum login, lempar ke halaman login
        return <Navigate to="/login" replace />;
    }

    // Jika sudah login, render anak-anaknya (Outlet)
    return <Outlet />;
};

export const RequireRole = ({ allowed, redirectTo = "/" }: { allowed: string[]; redirectTo?: string }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.role || !allowed.includes(user.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};

export const RequireAdmin = () => {
    return <RequireRole allowed={['admin']} />;
};