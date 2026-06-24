import { FiBarChart2, FiBookOpen, FiUsers } from "react-icons/fi";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
            EduAnalytics
          </p>

          <h1 className="mt-6 max-w-lg text-5xl font-bold leading-tight">
            Aprende, gestiona y mejora con datos.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Plataforma educativa para administrar cursos, evaluaciones, notas y
            visualizar el rendimiento académico.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <FiUsers className="text-blue-300" size={26} />
            <p className="mt-4 text-sm text-slate-400">Usuarios</p>
            <p className="mt-1 font-semibold">Roles seguros</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <FiBookOpen className="text-blue-300" size={26} />
            <p className="mt-4 text-sm text-slate-400">Académico</p>
            <p className="mt-1 font-semibold">Cursos y notas</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <FiBarChart2 className="text-blue-300" size={26} />
            <p className="mt-4 text-sm text-slate-400">Analítica</p>
            <p className="mt-1 font-semibold">Mejores decisiones</p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-slate-100 p-5 sm:p-8">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Plataforma educativa
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Inicia sesión
            </h2>

            <p className="mt-2 text-slate-500">
              Ingresa con tu correo institucional y contraseña.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </div>
  );
}