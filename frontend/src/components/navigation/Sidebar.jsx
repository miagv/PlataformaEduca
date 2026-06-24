import {
  FiBookOpen,
  FiClipboard,
  FiFileText,
  FiGrid,
  FiUserCheck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROLE_LABELS, ROLES } from "../../utils/roles";
import SidebarItem from "./SidebarItem";

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();

  const menuByRole = {
    [ROLES.ADMIN]: [
      { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
      { to: "/docentes", label: "Docentes", icon: FiUserCheck },
      { to: "/estudiantes", label: "Estudiantes", icon: FiUsers },
      { to: "/cursos", label: "Cursos", icon: FiBookOpen },
      { to: "/evaluaciones", label: "Evaluaciones", icon: FiClipboard },
      { to: "/notas", label: "Notas", icon: FiFileText },
    ],

    [ROLES.DOCENTE]: [
      { to: "/docente/dashboard", label: "Dashboard", icon: FiGrid },
      { to: "/cursos", label: "Mis cursos", icon: FiBookOpen },
      { to: "/evaluaciones", label: "Evaluaciones", icon: FiClipboard },
      { to: "/notas", label: "Registrar notas", icon: FiFileText },
    ],

    [ROLES.ESTUDIANTE]: [
      { to: "/estudiante/dashboard", label: "Mi progreso", icon: FiGrid },
      { to: "/cursos", label: "Mis cursos", icon: FiBookOpen },
      { to: "/mis-notas", label: "Mis notas", icon: FiFileText },
    ],
  };

  const menuItems = menuByRole[user?.rol] || [];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 px-4 py-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-start justify-between px-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Plataforma educativa
            </p>

            <h1 className="mt-2 text-2xl font-bold">EduAnalytics</h1>

            <p className="mt-1 text-sm text-slate-400">
              Gestión académica y analítica
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              onClick={onClose}
            >
              {item.label}
            </SidebarItem>
          ))}
        </nav>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold">
            {user?.nombres} {user?.apellidos}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {ROLE_LABELS[user?.rol] || user?.rol}
          </p>
        </div>
      </aside>
    </>
  );
}