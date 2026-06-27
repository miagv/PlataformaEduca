import { FiArrowLeft, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ComingSoonPage({ title = "Próximamente", description = "Esta sección está en desarrollo." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <FiClock className="text-3xl text-[#012169]" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#012169]">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
        <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white transition hover:bg-blue-900">
          <FiArrowLeft /> Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
