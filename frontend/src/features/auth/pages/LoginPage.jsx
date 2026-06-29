import { FiBarChart2, FiBookOpen, FiUsers } from "react-icons/fi";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#012169] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C8102E]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 p-12">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200">
              Startup EdTech · Reino Unido
            </span>
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-bold leading-tight text-white">
          El aprendizaje del futuro
            <span className="block text-[#C8102E]">garantizado.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-blue-200">
            Plataforma educativa para gestionar cursos, evaluaciones y notas de rendimiento académico.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 p-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/20">
              <FiUsers className="text-[#C8102E]" size={22} />
            </div>
            <p className="mt-4 text-xs font-medium text-blue-300">Usuarios</p>
            <p className="mt-0.5 font-semibold text-white">Ingresa tu usuario</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <FiBookOpen className="text-white" size={22} />
            </div>
            <p className="mt-4 text-xs font-medium text-blue-300">Académico</p>
            <p className="mt-0.5 font-semibold text-white">Cursos y notas</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/20">
              <FiBarChart2 className="text-[#C8102E]" size={22} />
            </div>
            <p className="mt-4 text-xs font-medium text-blue-300">Analítica</p>
            <p className="mt-0.5 font-semibold text-white">Mejores decisiones</p>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 px-12 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-[#C8102E]" />
              <span className="h-3 w-3 rounded-full bg-white" />
              <span className="h-3 w-3 rounded-full bg-[#C8102E]" />
            </div>
            <p className="text-xs text-blue-300">
              © 2026 Edu · Plataforma Educativa del Reino Unido
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#012169] shadow-lg shadow-[#012169]/20">
              <FiBookOpen className="text-white" size={28} />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-[#012169]">
              EduTech
            </h1>


            <p className="mt-1 text-sm text-slate-500">
              Inicia sesión en tu cuenta
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <LoginForm />
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
              <span className="h-2 w-2 rounded-full bg-[#012169]" />
              <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
            </div>
            <p className="mt-2">EduTech · Plataforma Educativa</p>
          </div>
        </div>
      </section>
    </div>
  );
}
