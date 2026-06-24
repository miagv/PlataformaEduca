import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { HOME_BY_ROLE } from "../utils/roles";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to={HOME_BY_ROLE[user.rol] || "/login"} replace />;
  }

  return <Outlet />;
}