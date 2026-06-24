import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Cargando sesión...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}