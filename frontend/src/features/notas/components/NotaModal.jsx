import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import NotaForm from "./NotaForm";
import { getEstudiantesPorSalon } from "../../estudiantes/services/estudianteService";
import { getEvaluacionesPorSalon } from "../../evaluaciones/services/evaluacionService";

export default function NotaModal({
  open,
  salones,
  onClose,
  onSubmit,
  loading,
}) {
  const [selectedSalonId, setSelectedSalonId] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!selectedSalonId) {
      setEstudiantes([]);
      setEvaluaciones([]);
      return;
    }
    (async () => {
      try {
        setDataLoading(true);
        const [estData, evalData] = await Promise.all([
          getEstudiantesPorSalon(Number(selectedSalonId)),
          getEvaluacionesPorSalon(Number(selectedSalonId)),
        ]);
        setEstudiantes(estData || []);
        setEvaluaciones(evalData || []);
      } catch {
        setEstudiantes([]);
        setEvaluaciones([]);
      } finally {
        setDataLoading(false);
      }
    })();
  }, [selectedSalonId]);

  useEffect(() => {
    if (!open) {
      setSelectedSalonId("");
      setEstudiantes([]);
      setEvaluaciones([]);
    }
  }, [open]);

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
              Selecciona el salón, estudiante y evaluación para asignar una nota.
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

        <div className="mb-5">
          <label
            htmlFor="modalSalonId"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Salón
          </label>

          <select
            id="modalSalonId"
            value={selectedSalonId}
            onChange={(e) => setSelectedSalonId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Selecciona un salón</option>

            {salones.map((s) => (
              <option key={s.id} value={s.id}>
                {s.grado} &quot;{s.seccion}&quot;
              </option>
            ))}
          </select>
        </div>

        {selectedSalonId && (
          <NotaForm
            estudiantes={estudiantes}
            evaluaciones={evaluaciones}
            dataLoading={dataLoading}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
