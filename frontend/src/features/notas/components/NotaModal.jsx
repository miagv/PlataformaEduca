import { FiX } from "react-icons/fi";
import NotaForm from "./NotaForm";

export default function NotaModal({
  open,
  estudiantes,
  evaluaciones,
  onClose,
  onSubmit,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Registrar nota
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Asigna una nota a un estudiante en una evaluación determinada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Cerrar"
          >
            <FiX size={22} />
          </button>
        </div>

        <NotaForm
          estudiantes={estudiantes}
          evaluaciones={evaluaciones}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </div>
  );
}