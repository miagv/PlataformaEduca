import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { hasRole } from "../../utils/roles";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}