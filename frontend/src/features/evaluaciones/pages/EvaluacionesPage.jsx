import { useEffect, useMemo, useState } from "react";
import {
  FiClipboard,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";
import { getSalones, getMisSalones } from "../../../api/salonService";

import EvaluacionModal from "../components/EvaluacionModal";
import EvaluacionesTable from "../components/EvaluacionesTable";
import DeleteEvaluacionModal from "../components/DeleteEvaluacionModal";
import { useEvaluaciones } from "../hooks/useEvaluaciones";

export default function EvaluacionesPage() {
  const { user } = useAuth();

  const {
    evaluaciones,
    loading,
    actionLoading,
    error,
    cargarEvaluaciones,
    guardarEvaluacion,
    eliminarEvaluacion,
  } = useEvaluaciones({ misEvaluaciones: user?.rol === ROLES.DOCENTE });

  const [salones, setSalones] = useState([]);

  const [search, setSearch] = useState("");
  const [cursoFilter, setCursoFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
  const [evaluacionAEliminar, setEvaluacionAEliminar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const canManage =
    user?.rol === ROLES.ADMIN || user?.rol === ROLES.DOCENTE;

  useEffect(() => {
    const load = user?.rol === ROLES.DOCENTE ? getMisSalones() : getSalones();
    load.then((data) => setSalones(data)).catch(() => {});
  }, []);

  const cursosUnicos = useMemo(() => {
    const map = new Map();
    evaluaciones.forEach((e) => {
      if (e.curso?.id && e.curso?.nombre) {
        map.set(e.curso.id, e.curso.nombre);
      }
    });
    return Array.from(map.entries())
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [evaluaciones]);

  const evaluacionesFiltradas = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = evaluaciones;

    if (term) {
      result = result.filter((evaluacion) => {
        const titulo = evaluacion.titulo?.toLowerCase() || "";
        const curso = evaluacion.curso?.nombre?.toLowerCase() || "";
        return titulo.includes(term) || curso.includes(term);
      });
    }

    if (cursoFilter) {
      result = result.filter((e) => e.curso?.nombre === cursoFilter);
    }

    return result;
  }, [evaluaciones, search, cursoFilter]);

  const abrirNuevaEvaluacion = () => {
    setSuccessMessage("");
    setEvaluacionSeleccionada(null);
    setModalOpen(true);
  };

  const abrirEditarEvaluacion = (evaluacion) => {
    setSuccessMessage("");
    setEvaluacionSeleccionada(evaluacion);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEvaluacionSeleccionada(null);
  };

  const handleGuardarEvaluacion = async (evaluacionData) => {
    const editando = Boolean(evaluacionSeleccionada);

    try {
      await guardarEvaluacion(
        evaluacionData,
        evaluacionSeleccionada?.id
      );

      setSuccessMessage(
        editando
          ? "Evaluación actualizada correctamente."
          : "Evaluación creada correctamente."
      );

      cerrarModal();
    } catch {
      // El hook ya maneja el mensaje de error.
    }
  };

  const handleEliminarEvaluacion = async () => {
    if (!evaluacionAEliminar) return;

    try {
      await eliminarEvaluacion(evaluacionAEliminar.id);

      setSuccessMessage("Evaluación eliminada correctamente.");
      setEvaluacionAEliminar(null);
    } catch {
      // El hook ya maneja el mensaje de error.
    }
  };

  const evaluacionesEsteMes = useMemo(() => {
    const now = new Date();
    return evaluaciones.filter((e) => {
      const fecha = new Date(e.fecha);
      return (
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [evaluaciones]);

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
            <FiClipboard size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#012169]">
              Gestión de evaluaciones
            </h1>

            <p className="mt-1 text-slate-600">
              Registra y consulta las evaluaciones de los cursos.
            </p>
          </div>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={abrirNuevaEvaluacion}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white transition hover:bg-blue-900"
          >
            <FiPlus size={20} />
            Nueva evaluación
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total de evaluaciones
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {evaluaciones.length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Cursos evaluados
          </p>
          <p className="mt-2 text-3xl font-bold text-violet-600">
            {
              new Set(
                evaluaciones
                  .map((evaluacion) => evaluacion.curso?.id)
                  .filter(Boolean)
              ).size
            }
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Evaluaciones este mes
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {evaluacionesEsteMes}
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

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por evaluación o curso..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <select
          value={cursoFilter}
          onChange={(e) => setCursoFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 sm:w-56"
        >
          <option value="">Todos los cursos</option>
          {cursosUnicos.map((c) => (
            <option key={c.id} value={c.nombre}>{c.nombre}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={cargarEvaluaciones}
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
            Cargando evaluaciones...
          </div>
        ) : (
          <EvaluacionesTable
            evaluaciones={evaluacionesFiltradas}
            canManage={canManage}
            onEdit={abrirEditarEvaluacion}
            onDelete={setEvaluacionAEliminar}
          />
        )}
      </div>

      <EvaluacionModal
        open={modalOpen}
        evaluacionSeleccionada={evaluacionSeleccionada}
        salones={salones}
        onClose={cerrarModal}
        onSubmit={handleGuardarEvaluacion}
        loading={actionLoading}
      />

      <DeleteEvaluacionModal
        open={Boolean(evaluacionAEliminar)}
        evaluacion={evaluacionAEliminar}
        onClose={() => !actionLoading && setEvaluacionAEliminar(null)}
        onConfirm={handleEliminarEvaluacion}
        loading={actionLoading}
      />
    </section>
  );
}