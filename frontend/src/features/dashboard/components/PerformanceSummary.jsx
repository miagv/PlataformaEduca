import { FiCheckCircle, FiTrendingUp } from "react-icons/fi";

export default function PerformanceSummary({
  promedioGeneral,
  porcentajeAprobados,
  totalNotas,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Resumen de rendimiento
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Indicadores calculados a partir de las notas registradas.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <FiTrendingUp size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-600">Promedio general</p>

              <p className="text-2xl font-bold text-slate-900">
                {promedioGeneral} / 20
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
              <FiCheckCircle size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-600">
                Porcentaje de notas aprobadas
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {porcentajeAprobados}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Total de notas registradas</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totalNotas}
          </p>
        </div>
      </div>
    </section>
  );
}