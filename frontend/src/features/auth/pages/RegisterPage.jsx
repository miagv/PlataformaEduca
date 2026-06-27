import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiBookOpen, FiEye, FiEyeOff, FiMail, FiUser, FiUserPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { ROLES, ROLE_LABELS } from "../../../utils/roles";

const ROLES_OPTIONS = [
  { value: ROLES.ESTUDIANTE, label: ROLE_LABELS[ROLES.ESTUDIANTE] },
  { value: ROLES.DOCENTE, label: ROLE_LABELS[ROLES.DOCENTE] },
  { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      rol: ROLES.ESTUDIANTE,
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");

    try {
      await axiosClient.post("/auth/register", data);
      setSuccessMessage("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setServerError(
        error.response?.data || "No se pudo completar el registro."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#012169] shadow-lg shadow-[#012169]/20">
            <FiUserPlus className="text-white" size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-[#012169]">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">
            Regístrate en la plataforma educativa
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}
            {successMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nombres" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nombres
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input id="nombres" type="text" placeholder="Nombres"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${
                      errors.nombres ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"
                    }`}
                    {...register("nombres", { required: "Campo obligatorio" })} />
                </div>
                {errors.nombres && <p className="mt-1 text-xs text-red-600">{errors.nombres.message}</p>}
              </div>
              <div>
                <label htmlFor="apellidos" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Apellidos
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input id="apellidos" type="text" placeholder="Apellidos"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${
                      errors.apellidos ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"
                    }`}
                    {...register("apellidos", { required: "Campo obligatorio" })} />
                </div>
                {errors.apellidos && <p className="mt-1 text-xs text-red-600">{errors.apellidos.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input id="email" type="email" placeholder="correo@ejemplo.com"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${
                    errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"
                  }`}
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
                  })} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <FiEye className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-12 text-sm outline-none transition focus:ring-4 ${
                    errors.password ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"
                  }`}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  })} />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  aria-label="Mostrar u ocultar contraseña">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="rol" className="mb-1.5 block text-sm font-semibold text-slate-700">Rol</label>
              <div className="relative">
                <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select id="rol"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100 appearance-none bg-white"
                  {...register("rol", { required: true })}>
                  {ROLES_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-xl bg-[#012169] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-blue-400">
              {isSubmitting ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-[#C8102E] hover:text-red-700">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
            <span className="h-2 w-2 rounded-full bg-[#012169]" />
            <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
          </div>
          <p className="mt-2">EduAnalytics · Plataforma Educativa del Reino Unido</p>
        </div>
      </div>
    </div>
  );
}
