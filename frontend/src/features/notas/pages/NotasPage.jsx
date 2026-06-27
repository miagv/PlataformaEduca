import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";

import { getSalones } from "../../../api/salonService";

import NotaModal from "../components/NotaModal";
import NotasTable from "../components/NotasTable";
import { useNotas } from "../hooks/useNotas";

export default function NotasPage() {
  const { user } = useAuth();

  const {
    notas,
    loading,
    actionLoading,
    error,
    cargarNotas,
    guardarNota,
  } = useNotas();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [salones, setSalones] = useState([]);
  const [salonFilter, setSalonFilter] = useState("");

  const canManage =
    user?.rol === ROLES.ADMIN || user?.rol === ROLES.DOCENTE;

  useEffect(() => {
    getSalones()
      .then((data) => setSalones(data))
      .catch(() => {});
  }, []);

  const notasFiltradas = useMemo(() => {
    return notas.filter((nota) => {
      const term = search.trim().toLowerCase();

      const estudiante = `${nota.estudiante?.usuario?.nombres || ""} ${
        nota.estudiante?.usuario?.apellidos || ""
      }`.toLowerCase();

      const codigo = nota.estudiante?.codigo?.toLowerCase() || "";
      const evaluacion = nota.evaluacion?.titulo?.toLowerCase() || "";
      const curso = nota.evaluacion?.curso?.nombre?.toLowerCase() || "";

      const matchesSearch = !term || estudiante.includes(term) || codigo.includes(term) || evaluacion.includes(term) || curso.includes(term);

      const salonId = nota.estudiante?.salon?.id?.toString() || "";
      const matchesSalon = !salonFilter || salonId === salonFilter;

      return matchesSearch && matchesSalon;
    });
  }, [notas, search, salonFilter]);

  const abrirModal = () => {
    setSuccessMessage("");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    if (actionLoading) return;
    setModalOpen(false);
  };

  const handleGuardarNota = async (notaData) => {
    try {
      await guardarNota(notaData);

      setSuccessMessage("Nota registrada correctamente.");
      cerrarModal();
    } catch {
      // El hook ya muestra el error.
    }
  };

  const promedioGeneral =
    notas.length > 0
      ? notas.reduce((total, nota) => total + Number(nota.nota || 0), 0) /
        notas.length
      : 0;

  const aprobados = notas.filter((nota) => Number(nota.nota || 0) >= 11).length;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
            <FiBookOpen size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#012169]">
              Registro de notas
            </h1>

            <p className="mt-1 text-slate-600">
              Consulta y registra el rendimiento académico de los estudiantes.
            </p>
          </div>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={abrirModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            <FiPlus size={20} />
            Registrar nota
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Notas registradas
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {notas.length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Promedio general
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {promedioGeneral.toFixed(2)}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Estudiantes aprobados
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {aprobados}
          </p>
        </article>
      </div>

      {successMessage && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por estudiante..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <select
          value={salonFilter}
          onChange={(e) => setSalonFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
        >
          <option value="">Todos los salones</option>
          {salones.map((s) => (
            <option key={s.id} value={s.id}>{s.grado} &quot;{s.seccion}&quot;</option>
          ))}
        </select>

        <button
          type="button"
          onClick={cargarNotas}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed"
        >
          <FiRefreshCw
            className={loading ? "animate-spin" : ""}
            size={18}
          />
          Actualizar
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Cargando notas...
          </div>
        ) : (
          <NotasTable notas={notasFiltradas} />
        )}
      </div>

      <NotaModal
        open={modalOpen}
        salones={salones}
        onClose={cerrarModal}
        onSubmit={handleGuardarNota}
        loading={actionLoading}
      />
    </section>
  );
}