import { Link } from "react-router-dom";
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <FiAlertTriangle className="mx-auto text-5xl text-amber-500" />

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Página no encontrada
        </h1>

        <p className="mt-3 text-slate-600">
          La página que intentas abrir no existe o ya no está disponible.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <FiArrowLeft />
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}