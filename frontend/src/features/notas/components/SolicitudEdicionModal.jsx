import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function SolicitudEdicionModal({ open, nota, onClose, onSubmit, loading }) {
  const [notaNueva, setNotaNueva] = useState("");
  const [motivo, setMotivo] = useState("");

  if (!open) return null;

  const handleEnviar = async () => {
    if (!notaNueva || !motivo.trim()) return;
    await onSubmit({
      notaId: nota.id,
      notaNueva: Number(notaNueva),
      motivo: motivo.trim(),
    });
    setNotaNueva("");
    setMotivo("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-slate-950/60" />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Solicitar edición de nota</h2>
            <p className="mt-1 text-sm text-slate-500">El coordinador revisará tu solicitud.</p>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Cerrar">
            <FiX size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p><span className="font-semibold text-slate-700">Estudiante:</span> {nota.estudiante?.usuario?.nombres} {nota.estudiante?.usuario?.apellidos}</p>
            <p><span className="font-semibold text-slate-700">Evaluación:</span> {nota.evaluacion?.titulo}</p>
            <p><span className="font-semibold text-slate-700">Curso:</span> {nota.evaluacion?.curso?.nombre}</p>
            <p><span className="font-semibold text-slate-700">Nota actual:</span> <span className="font-bold text-slate-900">{Number(nota.nota).toFixed(2)}</span></p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nueva nota</label>
            <input
              type="number" min="0" max="20" step="0.01"
              value={notaNueva}
              onChange={(e) => setNotaNueva(e.target.value)}
              placeholder="Ej: 16"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Motivo de la solicitud</label>
            <textarea
              rows="3"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica por qué necesitas modificar esta nota..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleEnviar}
            disabled={loading || !notaNueva || !motivo.trim()}
            className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:bg-amber-400"
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </div>
    </div>
  );
}