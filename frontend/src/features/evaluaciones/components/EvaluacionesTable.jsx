import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

function formatFecha(fecha) {
  if (!fecha) return "Sin fecha";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fecha}T00:00:00`));
}

export default function EvaluacionesTable({
  evaluaciones,
  canManage,
  onEdit,
  onDelete,
}) {
  if (evaluaciones.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          No hay evaluaciones registradas
        </h3>

        <p className="mt-2 text-slate-500">
          {canManage
            ? "Crea la primera evaluación usando el botón “Nueva evaluación”."
            : "Aún no existen evaluaciones disponibles para consultar."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">Evaluación</th>
              <th className="px-5 py-4">Curso</th>
              <th className="px-5 py-4">Porcentaje</th>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {evaluaciones.map((evaluacion) => (
              <tr key={evaluacion.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">
                    {evaluacion.titulo}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    ID: {evaluacion.id}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {evaluacion.curso?.nombre || "Curso no disponible"}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {evaluacion.porcentaje}%
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatFecha(evaluacion.fecha)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {canManage ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(evaluacion)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Editar evaluación"
                        >
                          <FiEdit2 size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(evaluacion)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Eliminar evaluación"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <span
                        className="rounded-lg p-2 text-slate-400"
                        title="Solo consulta"
                      >
                        <FiEye size={18} />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}