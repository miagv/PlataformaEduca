import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function NotaForm({
  estudiantes,
  evaluaciones,
  dataLoading,
  onSubmit,
  onCancel,
  loading,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      estudianteId: "",
      evaluacionId: "",
      nota: "",
      observacion: "",
    },
  });

  const evaluacionIdSeleccionada = watch("evaluacionId");

  useEffect(() => {
    reset({
      estudianteId: "",
      evaluacionId: "",
      nota: "",
      observacion: "",
    });
  }, [reset, estudiantes, evaluaciones]);

  const evaluacionSeleccionada = evaluaciones.find(
    (evaluacion) =>
      String(evaluacion.id) === String(evaluacionIdSeleccionada)
  );

  const enviarFormulario = (data) => {
    onSubmit({
      nota: Number(data.nota),
      observacion: data.observacion.trim(),
      evaluacion: {
        id: Number(data.evaluacionId),
      },
      estudiante: {
        id: Number(data.estudianteId),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(enviarFormulario)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="estudianteId"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Estudiante
          </label>

          <select
            id="estudianteId"
            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
              errors.estudianteId
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("estudianteId", {
              required: "Debes seleccionar un estudiante.",
            })}
          >
            <option value="">Selecciona un estudiante</option>

            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.usuario?.nombres} {estudiante.usuario?.apellidos}
                {estudiante.codigo ? ` — ${estudiante.codigo}` : ""}
              </option>
            ))}
          </select>

          {errors.estudianteId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.estudianteId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="evaluacionId"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Evaluación
          </label>

          <select
            id="evaluacionId"
            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
              errors.evaluacionId
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("evaluacionId", {
              required: "Debes seleccionar una evaluación.",
            })}
          >
            <option value="">Selecciona una evaluación</option>

            {evaluaciones.map((evaluacion) => (
              <option key={evaluacion.id} value={evaluacion.id}>
                {evaluacion.titulo} — {evaluacion.curso?.nombre || "Sin curso"}
              </option>
            ))}
          </select>

          {errors.evaluacionId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.evaluacionId.message}
            </p>
          )}
        </div>
      </div>

      {evaluacionSeleccionada && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p>
            <span className="font-bold">Curso:</span>{" "}
            {evaluacionSeleccionada.curso?.nombre || "No disponible"}
          </p>

          <p className="mt-1">
            <span className="font-bold">Evaluación:</span>{" "}
            {evaluacionSeleccionada.porcentaje}%
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="nota"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Nota obtenida
        </label>

        <input
          id="nota"
          type="number"
          min="0"
          max="20"
          step="0.01"
          placeholder="Ejemplo: 18"
          className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
            errors.nota
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          {...register("nota", {
            required: "La nota es obligatoria.",
            min: {
              value: 0,
              message: "La nota no puede ser menor que 0.",
            },
            max: {
              value: 20,
              message: "La nota no puede ser mayor que 20.",
            },
          })}
        />

        {errors.nota && (
          <p className="mt-1 text-sm text-red-600">{errors.nota.message}</p>
        )}

        <p className="mt-1 text-xs text-slate-500">
          En este proyecto la escala de calificación es de 0 a 20.
        </p>
      </div>

      <div>
        <label
          htmlFor="observacion"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Observación
        </label>

        <textarea
          id="observacion"
          rows="4"
          placeholder="Ejemplo: Participó activamente y resolvió correctamente el examen."
          className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
            errors.observacion
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          {...register("observacion", {
            maxLength: {
              value: 300,
              message: "La observación no puede superar 300 caracteres.",
            },
          })}
        />

        {errors.observacion && (
          <p className="mt-1 text-sm text-red-600">
            {errors.observacion.message}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={
            loading || dataLoading || estudiantes.length === 0 || evaluaciones.length === 0
          }
          className="rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? "Registrando..." : "Registrar nota"}
        </button>
      </div>
    </form>
  );
}