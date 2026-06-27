import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE } from "../../../utils/roles";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const user = await login(data);
      navigate(HOME_BY_ROLE[user.rol] || "/login", { replace: true });
    } catch (error) {
      const backendMessage =
        error.response?.data ||
        error.message ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";

      setServerError(
        typeof backendMessage === "string"
          ? backendMessage
          : "No se pudo iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Correo electrónico
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            id="email" type="email" placeholder="correo@ejemplo.com"
            className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${
              errors.email
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"
            }`}
            {...register("email", {
              required: "El correo es obligatorio.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Ingresa un correo válido." },
            })}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Contraseña
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            id="password" type={showPassword ? "text" : "password"} placeholder="Ingresa tu contraseña"
            className={`w-full rounded-xl border py-3 pl-10 pr-12 text-sm outline-none transition focus:ring-4 ${
              errors.password
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"
            }`}
            {...register("password", {
              required: "La contraseña es obligatoria.",
              minLength: { value: 4, message: "La contraseña debe tener al menos 4 caracteres." },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
            aria-label="Mostrar u ocultar contraseña"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#012169] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <div className="text-center">
        <a
          href="/recuperar-contrasena"
          className="text-sm font-medium text-slate-500 hover:text-[#012169]"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  );
}
