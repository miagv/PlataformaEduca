import { NavLink } from "react-router-dom";
import { FiBookOpen, FiLogOut, FiX } from "react-icons/fi";

import { navigationItems } from "../../config/navigation";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROLE_LABELS } from "../../utils/roles";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user?.rol)
  );

  const nombreCompleto =
    `${user?.nombres || ""} ${user?.apellidos || ""}`.trim() ||
    user?.email ||
    "Usuario";

  function handleLogout() {
    logout();
    onClose?.();
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2">
              <FiBookOpen size={22} />
            </div>

            <div>
              <p className="font-bold">EduAnalytics</p>
              <p className="text-xs text-slate-400">Plataforma Educativa</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Cerrar menú"
          >
            <FiX size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Menú principal
          </p>

          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <div className="mb-4 rounded-xl bg-slate-800 p-4">
            <p className="truncate font-semibold text-white">{nombreCompleto}</p>

            <p className="mt-1 text-sm text-slate-400">
              {ROLE_LABELS[user?.rol] || user?.rol}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            <FiLogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}