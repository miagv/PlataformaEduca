export const ROLES = {
  ADMIN: "ADMIN",
  DOCENTE: "DOCENTE",
  ESTUDIANTE: "ESTUDIANTE",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Coordinador",
  [ROLES.DOCENTE]: "Docente",
  [ROLES.ESTUDIANTE]: "Estudiante",
};

export const HOME_BY_ROLE = {
  [ROLES.ADMIN]: "/dashboard",
  [ROLES.DOCENTE]: "/dashboard",
  [ROLES.ESTUDIANTE]: "/dashboard",
};

export function hasRole(user, allowedRoles = []) {
  if (!user?.rol) return false;

  return allowedRoles.includes(user.rol);
}