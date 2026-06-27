import { Link } from "react-router-dom";
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <FiAlertTriangle className="text-3xl text-[#C8102E]" />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-[#012169]">
          Página no encontrada
        </h1>

        <p className="mt-3 text-slate-600">
          La página que intentas abrir no existe o ya no está disponible.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white transition hover:bg-blue-900"
        >
          <FiArrowLeft />
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}
