import { FiBell, FiMenu } from "react-icons/fi";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROLE_LABELS } from "../utils/roles";

export default function Header({ onOpenMenu }) {
  const { user } = useAuth();

  const nombre =
    user?.nombres ||
    user?.email?.split("@")[0] ||
    "Usuario";

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-xl p-3 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <FiMenu size={22} />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-lg font-bold text-[#012169]">Panel académico</h2>
          <p className="text-sm text-slate-500">
            Hola, <span className="font-medium text-slate-700">{nombre}</span>
            {user?.rol && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#012169]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8102E]" />
                {ROLE_LABELS[user.rol] || user.rol}
              </span>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="relative rounded-xl p-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notificaciones"
      >
        <FiBell size={21} />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#C8102E] ring-2 ring-white" />
      </button>
    </header>
  );
}
