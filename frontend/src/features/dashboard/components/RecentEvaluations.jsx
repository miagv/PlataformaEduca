import { FiCalendar, FiClipboard } from "react-icons/fi";

function formatDate(date) {
  if (!date) return "Sin fecha";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function RecentEvaluations({ evaluaciones = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Evaluaciones recientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Últimas evaluaciones registradas.
          </p>
        </div>

        <FiClipboard className="text-2xl text-blue-600" />
      </div>

      <div className="space-y-3">
        {evaluaciones.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No hay evaluaciones registradas.
          </div>
        ) : (
          evaluaciones.map((evaluacion) => (
            <article
              key={evaluacion.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">
                  {evaluacion.titulo}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {evaluacion.curso?.nombre || "Curso no asignado"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-bold text-blue-600">
                  {evaluacion.porcentaje}%
                </p>

                <p className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500">
                  <FiCalendar />
                  {formatDate(evaluacion.fecha)}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}