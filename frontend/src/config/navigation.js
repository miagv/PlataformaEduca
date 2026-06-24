import {
  FiBarChart2,
  FiBookOpen,
  FiClipboard,
  FiEdit3,
  FiFileText,
  FiHome,
  FiLayers,
  FiUsers,
} from "react-icons/fi";

import { ROLES } from "../utils/roles";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: FiHome,
    roles: [ROLES.ADMIN, ROLES.DOCENTE, ROLES.ESTUDIANTE],
  },
  {
    label: "Gestión de cursos",
    path: "/cursos",
    icon: FiBookOpen,
    roles: [ROLES.ADMIN, ROLES.DOCENTE],
  },
  {
    label: "Gestión de docentes",
    path: "/docentes",
    icon: FiUsers,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Gestión de estudiantes",
    path: "/estudiantes",
    icon: FiUsers,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Evaluaciones",
    path: "/evaluaciones",
    icon: FiClipboard,
    roles: [ROLES.ADMIN, ROLES.DOCENTE],
  },
  {
    label: "Registro de notas",
    path: "/notas",
    icon: FiEdit3,
    roles: [ROLES.ADMIN, ROLES.DOCENTE],
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: FiBarChart2,
    roles: [ROLES.ADMIN, ROLES.DOCENTE],
  },
  {
    label: "Mi progreso",
    path: "/mi-progreso",
    icon: FiLayers,
    roles: [ROLES.ESTUDIANTE],
  },
  {
    label: "Mis evaluaciones",
    path: "/mis-evaluaciones",
    icon: FiFileText,
    roles: [ROLES.ESTUDIANTE],
  },
];