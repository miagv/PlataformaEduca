import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiKey } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPasswordRequest } from "../services/authService";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const defaultToken = location.state?.token || "";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { token: defaultToken, newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setMsg("");
    if (data.newPassword !== data.confirmPassword) {
      setMsg("Las contraseñas no coinciden");
      return;
    }
    try {
      await resetPasswordRequest(data.token, data.newPassword);
      setMsg("¡Contraseña restablecida exitosamente!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.mensaje || "Error al restablecer la contraseña");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#012169] shadow-lg">
            <FiKey className="text-white" size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-[#012169]">Nueva contraseña</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresa tu nueva contraseña</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
          {msg && (
            <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              msg.includes("exitosamente")
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Código de recuperación</label>
              <input
                type="text" placeholder="000000"
                className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm text-center font-mono outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                {...register("token", { required: "El código es obligatorio" })}
              />
              {errors.token && <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-slate-300 py-3 px-4 pr-12 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                  {...register("newPassword", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirmar contraseña</label>
              <input
                type="password" placeholder="Repite la contraseña"
                className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                {...register("confirmPassword", { required: "Confirma tu contraseña" })}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full rounded-xl bg-[#012169] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:bg-blue-400"
            >
              {isSubmitting ? "Restableciendo..." : "Restablecer contraseña"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#012169]">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
