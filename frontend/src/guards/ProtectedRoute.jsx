import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import LoadingScreen from "../common/LoadingScreen";

export default function ProtectedRoute() {
  const { isAuthenticated, loadingAuth: loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}