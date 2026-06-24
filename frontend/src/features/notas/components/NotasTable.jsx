import { FiEye } from "react-icons/fi";

function getNombreEstudiante(estudiante) {
  if (!estudiante?.usuario) return "Estudiante no disponible";

  return `${estudiante.usuario.nombres || ""} ${
    estudiante.usuario.apellidos || ""
  }`.trim();
}

export default function NotasTable({ notas, onlyView = false }) {
  if (notas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          No hay notas registradas
        </h3>

        <p className="mt-2 text-slate-500">
          {onlyView
            ? "Aún no tienes notas disponibles."
            : "Registra una nota usando el botón “Registrar nota”."}
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
              {!onlyView && <th className="px-5 py-4">Estudiante</th>}
              <th className="px-5 py-4">Evaluación</th>
              <th className="px-5 py-4">Curso</th>
              <th className="px-5 py-4">Nota</th>
              <th className="px-5 py-4">Observación</th>
              <th className="px-5 py-4 text-right">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {notas.map((nota) => {
              const valorNota = Number(nota.nota || 0);
              const aprobado = valorNota >= 11;

              return (
                <tr key={nota.id} className="hover:bg-slate-50">
                  {!onlyView && (
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {getNombreEstudiante(nota.estudiante)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Código: {nota.estudiante?.codigo || "Sin código"}
                      </p>
                    </td>
                  )}

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {nota.evaluacion?.titulo || "Evaluación no disponible"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Peso: {nota.evaluacion?.porcentaje || 0}%
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {nota.evaluacion?.curso?.nombre || "Curso no disponible"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xl font-bold text-slate-900">
                      {valorNota.toFixed(2)}
                    </span>

                    <span className="ml-1 text-sm text-slate-400">/ 20</span>
                  </td>

                  <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                    <p className="line-clamp-2">
                      {nota.observacion || "Sin observación"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          aprobado
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <FiEye size={13} />
                        {aprobado ? "Aprobado" : "Desaprobado"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}