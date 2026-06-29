import { NavLink } from "react-router-dom";
import { FiBookOpen, FiLogOut, FiX } from "react-icons/fi";
import { navigationItems } from "../config/navigation";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROLE_LABELS } from "../utils/roles";

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
          className="fixed inset-0 z-30 bg-uk-navy/60 lg:hidden"
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#012169] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <FiBookOpen size={22} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight">EduTech</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-blue-200">
                Plataforma Educativa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-blue-200 hover:bg-white/10 lg:hidden"
            aria-label="Cerrar menú"
          >
            <FiX size={21} />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
              Reino Unido
            </p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
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
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-blue-200 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-white">
              {nombreCompleto}
            </p>
            <p className="mt-0.5 text-xs text-blue-200">
              {ROLE_LABELS[user?.rol] || user?.rol}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <FiLogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
