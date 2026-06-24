import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CursoForm({
  cursoSeleccionado,
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
      nombre: "",
      descripcion: "",
      creditos: "",
      estado: true,
    },
  });

  useEffect(() => {
    if (cursoSeleccionado) {
      reset({
        nombre: cursoSeleccionado.nombre || "",
        descripcion: cursoSeleccionado.descripcion || "",
        creditos: cursoSeleccionado.creditos || "",
        estado:
          cursoSeleccionado.estado === undefined
            ? true
            : cursoSeleccionado.estado,
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
        creditos: "",
        estado: true,
      });
    }
  }, [cursoSeleccionado, reset]);

  const enviarFormulario = (data) => {
    onSubmit({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      creditos: Number(data.creditos),
      estado: data.estado === "true" || data.estado === true,
    });
  };

  return (
    <form onSubmit={handleSubmit(enviarFormulario)} className="space-y-5">
      <div>
        <label
          htmlFor="nombre"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Nombre del curso
        </label>

        <input
          id="nombre"
          type="text"
          placeholder="Ejemplo: Desarrollo Web"
          className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
            errors.nombre
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          {...register("nombre", {
            required: "El nombre del curso es obligatorio.",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 100,
              message: "El nombre no puede superar 100 caracteres.",
            },
          })}
        />

        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="descripcion"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Descripción
        </label>

        <textarea
          id="descripcion"
          rows="4"
          placeholder="Describe brevemente el contenido del curso"
          className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
            errors.descripcion
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
          {...register("descripcion", {
            required: "La descripción es obligatoria.",
            minLength: {
              value: 10,
              message: "La descripción debe tener al menos 10 caracteres.",
            },
            maxLength: {
              value: 500,
              message: "La descripción no puede superar 500 caracteres.",
            },
          })}
        />

        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="creditos"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Créditos
          </label>

          <input
            id="creditos"
            type="number"
            min="1"
            max="30"
            placeholder="Ejemplo: 4"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
              errors.creditos
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
            {...register("creditos", {
              required: "Los créditos son obligatorios.",
              min: {
                value: 1,
                message: "Los créditos deben ser como mínimo 1.",
              },
              max: {
                value: 30,
                message: "Los créditos no pueden superar 30.",
              },
            })}
          />

          {errors.creditos && (
            <p className="mt-1 text-sm text-red-600">
              {errors.creditos.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="estado"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Estado
          </label>

          <select
            id="estado"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            {...register("estado")}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
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
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading
            ? "Guardando..."
            : cursoSeleccionado
            ? "Guardar cambios"
            : "Crear curso"}
        </button>
      </div>
    </form>
  );
}