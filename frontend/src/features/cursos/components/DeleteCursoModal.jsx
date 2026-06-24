import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function DeleteCursoModal({
  open,
  curso,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open || !curso) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <FiAlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Eliminar curso
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="mt-6 text-slate-700">
          ¿Deseas eliminar el curso{" "}
          <span className="font-bold">{curso.nombre}</span>?
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}