function getEstado(nota) {
  return nota >= 11 ? "Aprobado" : "Desaprobado";
}

export default function RecentNotasTable({ notas }) {
  if (!notas.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        Todavía no existen notas registradas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Estudiante</th>
            <th className="px-4 py-3">Evaluación</th>
            <th className="px-4 py-3">Curso</th>
            <th className="px-4 py-3">Nota</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {notas.map((nota) => {
            const aprobado = nota.nota >= 11;

            return (
              <tr key={nota.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">
                    {nota.estudiante}
                  </p>

                  <p className="text-xs text-slate-400">{nota.codigo}</p>
                </td>

                <td className="px-4 py-3 text-sm text-slate-700">
                  {nota.evaluacion}
                </td>

                <td className="px-4 py-3 text-sm text-slate-600">
                  {nota.curso}
                </td>

                <td className="px-4 py-3 font-bold text-slate-800">
                  {nota.nota.toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      aprobado
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {getEstado(nota.nota)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}