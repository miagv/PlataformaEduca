import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

export default function CursosTable({
  cursos,
  canManage,
  onEdit,
  onDelete,
}) {
  if (cursos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          No hay cursos registrados
        </h3>

        <p className="mt-2 text-slate-500">
          {canManage
            ? "Crea el primer curso usando el botón “Nuevo curso”."
            : "Aún no existen cursos disponibles para consultar."}
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
              <th className="px-5 py-4">Curso</th>
              <th className="px-5 py-4">Descripción</th>
              <th className="px-5 py-4">Créditos</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {cursos.map((curso) => (
              <tr key={curso.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">{curso.nombre}</p>
                  <p className="mt-1 text-xs text-slate-400">ID: {curso.id}</p>
                </td>

                <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                  <p className="line-clamp-2">
                    {curso.descripcion || "Sin descripción"}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-slate-700">
                  {curso.creditos}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      curso.estado
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {curso.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {canManage ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(curso)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Editar curso"
                        >
                          <FiEdit2 size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(curso)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Eliminar curso"
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