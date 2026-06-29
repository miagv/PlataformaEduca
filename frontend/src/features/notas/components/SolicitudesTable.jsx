import { FiCheck, FiX } from "react-icons/fi";

const estadoBadge = {
  PENDIENTE: "bg-amber-100 text-amber-700",
  APROBADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-red-100 text-red-700",
};

export default function SolicitudesTable({ solicitudes, isAdmin, onAprobar, onRechazar, actionLoading }) {
  if (solicitudes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-lg font-bold text-slate-800">No hay solicitudes</h3>
        <p className="mt-2 text-slate-500">No se han registrado solicitudes de edición de notas.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isAdmin && <th className="px-5 py-4">Docente</th>}
              <th className="px-5 py-4">Estudiante</th>
              <th className="px-5 py-4">Curso</th>
              <th className="px-5 py-4">Nota actual</th>
              <th className="px-5 py-4">Nota solicitada</th>
              <th className="px-5 py-4">Motivo</th>
              <th className="px-5 py-4">Estado</th>
              {isAdmin && <th className="px-5 py-4 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {solicitudes.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                {isAdmin && (
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{s.docente?.usuario?.nombres} {s.docente?.usuario?.apellidos}</p>
                    <p className="text-xs text-slate-400">{s.docente?.especialidad}</p>
                  </td>
                )}
                <td className="px-5 py-4 text-sm text-slate-700">
                  {s.nota?.estudiante?.usuario?.nombres} {s.nota?.estudiante?.usuario?.apellidos}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {s.nota?.evaluacion?.curso?.nombre}
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-slate-500">{Number(s.notaAnterior).toFixed(2)}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-lg font-bold text-slate-900">{Number(s.notaNueva).toFixed(2)}</span>
                </td>
                <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                  <p className="line-clamp-2">{s.motivo}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${estadoBadge[s.estado] || "bg-slate-100 text-slate-700"}`}>
                    {s.estado}
                  </span>
                  {s.estado === "RECHAZADO" && s.motivoRechazo && (
                    <p className="mt-1 text-xs text-red-500 line-clamp-1">{s.motivoRechazo}</p>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-5 py-4 text-right">
                    {s.estado === "PENDIENTE" && (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onAprobar(s.id)}
                          disabled={actionLoading}
                          className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                          title="Aprobar"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => onRechazar(s)}
                          disabled={actionLoading}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          title="Rechazar"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}