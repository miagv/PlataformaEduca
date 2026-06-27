import { useAuth } from "../../auth/hooks/useAuth";
import { ROLE_LABELS } from "../../../utils/roles";

export default function DashboardHeader() {
  const { user } = useAuth();

  const nombre = user?.nombres || user?.email?.split("@")[0] || "Usuario";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#012169] p-6 text-white shadow-lg sm:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C8102E]/20 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8102E]" />
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-blue-200">
            {ROLE_LABELS[user?.rol] || "Usuario"}
          </p>
        </div>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Bienvenido, {nombre}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-200 sm:text-base">
          Consulta indicadores académicos, rendimiento de estudiantes,
          evaluaciones registradas y progreso general de la plataforma.
        </p>
      </div>
    </section>
  );
}
