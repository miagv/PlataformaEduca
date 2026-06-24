import { FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROLE_LABELS } from "../../utils/roles";

export default function Navbar({ onOpenSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <FiMenu size={24} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Bienvenido, {user?.nombres}
          </h2>

          <p className="text-sm text-slate-500">
            Panel de {ROLE_LABELS[user?.rol] || user?.rol}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <FiLogOut size={18} />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </button>
    </header>
  );
}