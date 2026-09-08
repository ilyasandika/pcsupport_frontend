import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext"; // Sesuaikan path import

export const RequireAuth = () => {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export const RequireRole = ({ allowed, redirectTo = "/" }: { allowed: string[]; redirectTo?: string }) => {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
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

export const RequireNoLogin = () => {
    const { user, isAuthLoading } = useAuth();
    if (isAuthLoading && user) {
        return null;
    }
    return user ? <Navigate to="/" replace /> : <Outlet />;
};