import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EvaluacionForm({
  evaluacionSeleccionada,
  cursos,
  onSubmit,
  onCancel,
  loading,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      titulo: "",
      porcentaje: "",
      fecha: "",
      cursoId: "",
    },
  });

  useEffect(() => {
    if (evaluacionSeleccionada) {
      reset({
        titulo: evaluacionSeleccionada.titulo || "",
        porcentaje: evaluacionSeleccionada.porcentaje || "",
        fecha: evaluacionSeleccionada.fecha || "",
        cursoId: evaluacionSeleccionada.curso?.id || "",
      });
    } else {
      reset({
        titulo: "",
        porcentaje: "",
        fecha: "",
        cursoId: "",
      });
    }
  }, [evaluacionSeleccionada, reset]);

  const enviarFormulario = (data) => {
    onSubmit({
      titulo: data.titulo.trim(),
      porcentaje: Number(data.porcentaje),
      fecha: data.fecha,
      curso: {
        id: Number(data.cursoId),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(enviarFormulario)} className="space-y-5">
      <div>
        <label
          htmlFor="titulo"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Título de la evaluación
        </label>

        <input
          id="titulo"
          type="text"
          placeholder="Ejemplo: Examen parcial"
          className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
            errors.titulo
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          {...register("titulo", {
            required: "El título es obligatorio.",
            minLength: {
              value: 3,
              message: "El título debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 120,
              message: "El título no puede superar 120 caracteres.",
            },
          })}
        />

        {errors.titulo && (
          <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="porcentaje"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Porcentaje de la evaluación
          </label>

          <div className="relative">
            <input
              id="porcentaje"
              type="number"
              min="1"
              max="100"
              step="0.01"
              placeholder="Ejemplo: 30"
              className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none transition focus:ring-4 ${
                errors.porcentaje
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
              {...register("porcentaje", {
                required: "El porcentaje es obligatorio.",
                min: {
                  value: 1,
                  message: "El porcentaje debe ser mayor a 0.",
                },
                max: {
                  value: 100,
                  message: "El porcentaje no puede superar 100.",
                },
              })}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
              %
            </span>
          </div>

          {errors.porcentaje && (
            <p className="mt-1 text-sm text-red-600">
              {errors.porcentaje.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="fecha"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Fecha
          </label>

          <input
            id="fecha"
            type="date"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
              errors.fecha
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("fecha", {
              required: "La fecha es obligatoria.",
            })}
          />

          {errors.fecha && (
            <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="cursoId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Curso asociado
        </label>

        <select
          id="cursoId"
          className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
            errors.cursoId
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          {...register("cursoId", {
            required: "Debes seleccionar un curso.",
          })}
        >
          <option value="">Selecciona un curso</option>

          {cursos
            .filter((curso) => curso.estado)
            .map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre} — {curso.creditos} créditos
              </option>
            ))}
        </select>

        {errors.cursoId && (
          <p className="mt-1 text-sm text-red-600">{errors.cursoId.message}</p>
        )}

        {cursos.length === 0 && (
          <p className="mt-2 text-sm text-amber-600">
            No hay cursos disponibles. Primero debes registrar un curso.
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
          disabled={loading || cursos.length === 0}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading
            ? "Guardando..."
            : evaluacionSeleccionada
            ? "Guardar cambios"
            : "Crear evaluación"}
        </button>
      </div>
    </form>
  );
}