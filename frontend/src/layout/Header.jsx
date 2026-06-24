import { FiBell, FiMenu } from "react-icons/fi";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Header({ onOpenMenu }) {
  const { user } = useAuth();

  const nombre =
    user?.nombres ||
    user?.email?.split("@")[0] ||
    "Usuario";

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-xl p-3 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <FiMenu size={23} />
        </button>

        <div>
          <h2 className="font-bold text-slate-900">Panel académico</h2>
          <p className="text-sm text-slate-500">
            Hola, {nombre}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="rounded-xl p-3 text-slate-600 hover:bg-slate-100"
        aria-label="Notificaciones"
      >
        <FiBell size={21} />
      </button>
    </header>
  );
}