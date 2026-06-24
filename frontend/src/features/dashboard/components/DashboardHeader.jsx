import { useAuth } from "../../auth/hooks/useAuth";
import { ROLE_LABELS } from "../../../utils/roles";

export default function DashboardHeader() {
  const { user } = useAuth();

  const nombre = user?.nombres || user?.email?.split("@")[0] || "Usuario";

  return (
    <section className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
      <p className="text-sm font-medium text-blue-100">
        {ROLE_LABELS[user?.rol] || "Usuario"}
      </p>

      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
        Bienvenido, {nombre}
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
        Consulta indicadores académicos, rendimiento de estudiantes,
        evaluaciones registradas y progreso general de la plataforma.
      </p>
    </section>
  );
}