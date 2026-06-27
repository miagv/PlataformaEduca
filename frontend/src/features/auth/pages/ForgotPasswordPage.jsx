import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiMail, FiKey } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../services/authService";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmitEmail = async (data) => {
    setMsg("");
    try {
      const res = await forgotPasswordRequest(data.email);
      setEmail(data.email);
      if (res.token) setToken(res.token);
      setMsg(res.mensaje);
      setStep("token");
    } catch (err) {
      setMsg(err.response?.data?.mensaje || "Error al enviar código");
    }
  };

  const onSubmitToken = async (data) => {
    try {
      navigate("/restablecer-contrasena", { state: { token: data.token, email } });
    } catch (err) {
      setMsg("Error al validar código");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#012169] shadow-lg">
            <FiKey className="text-white" size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-[#012169]">Recuperar contraseña</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresa tu correo para recibir un código</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
          {msg && (
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              {msg}
              {token && (
                <p className="mt-2 font-mono text-lg font-bold text-[#012169]">{token}</p>
              )}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Correo electrónico</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="email" placeholder="correo@ejemplo.com"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                    {...register("email", { required: "El correo es obligatorio" })}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full rounded-xl bg-[#012169] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:bg-blue-400"
              >
                {isSubmitting ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          )}

          {step === "token" && (
            <form onSubmit={handleSubmit(onSubmitToken)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Código de recuperación</label>
                <input
                  type="text" placeholder="000000"
                  className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm text-center font-mono text-lg outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                  {...register("token", { required: "El código es obligatorio" })}
                />
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full rounded-xl bg-[#012169] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:bg-blue-400"
              >
                {isSubmitting ? "Validando..." : "Validar código"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#012169]">
              <FiArrowLeft size={16} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
