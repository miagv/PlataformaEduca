import { useMemo, useState } from "react";
import { FiBookOpen, FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";
import CursoModal from "../components/CursoModal";
import CursosTable from "../components/CursosTable";
import DeleteCursoModal from "../components/DeleteCursoModal";
import { useCursos } from "../hooks/useCursos";

export default function CursosPage() {
  const { user } = useAuth();

  const {
    cursos,
    loading,
    actionLoading,
    error,
    cargarCursos,
    guardarCurso,
    eliminarCurso,
  } = useCursos();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const canManage = user?.rol === ROLES.ADMIN;

  const cursosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return cursos;

    return cursos.filter((curso) => {
      const nombre = curso.nombre?.toLowerCase() || "";
      const descripcion = curso.descripcion?.toLowerCase() || "";

      return nombre.includes(term) || descripcion.includes(term);
    });
  }, [cursos, search]);

  const abrirNuevoCurso = () => {
    setSuccessMessage("");
    setCursoSeleccionado(null);
    setModalOpen(true);
  };

  const abrirEditarCurso = (curso) => {
    setSuccessMessage("");
    setCursoSeleccionado(curso);
    setModalOpen(true);
  };

  const cerrarModalCurso = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setCursoSeleccionado(null);
  };

  const handleGuardarCurso = async (cursoData) => {
    const editando = Boolean(cursoSeleccionado);

    try {
      await guardarCurso(cursoData, cursoSeleccionado?.id);

      setSuccessMessage(
        editando
          ? "Curso actualizado correctamente."
          : "Curso creado correctamente."
      );

      cerrarModalCurso();
    } catch {
      // El hook ya guarda el mensaje de error.
    }
  };

  const handleEliminarCurso = async () => {
    if (!cursoAEliminar) return;

    try {
      await eliminarCurso(cursoAEliminar.id);

      setSuccessMessage("Curso eliminado correctamente.");
      setCursoAEliminar(null);
    } catch {
      // El hook ya guarda el mensaje de error.
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FiBookOpen size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Gestión de cursos
              </h1>

              <p className="mt-1 text-slate-600">
                Consulta y administra los cursos académicos registrados.
              </p>
            </div>
          </div>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={abrirNuevoCurso}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus size={20} />
            Nuevo curso
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total de cursos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {cursos.length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Cursos activos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {cursos.filter((curso) => curso.estado).length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Créditos acumulados
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {cursos.reduce(
              (total, curso) => total + Number(curso.creditos || 0),
              0
            )}
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
            placeholder="Buscar por nombre o descripción..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={cargarCursos}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
          Actualizar
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Cargando cursos...
          </div>
        ) : (
          <CursosTable
            cursos={cursosFiltrados}
            canManage={canManage}
            onEdit={abrirEditarCurso}
            onDelete={setCursoAEliminar}
          />
        )}
      </div>

      <CursoModal
        open={modalOpen}
        cursoSeleccionado={cursoSeleccionado}
        onClose={cerrarModalCurso}
        onSubmit={handleGuardarCurso}
        loading={actionLoading}
      />

      <DeleteCursoModal
        open={Boolean(cursoAEliminar)}
        curso={cursoAEliminar}
        onClose={() => !actionLoading && setCursoAEliminar(null)}
        onConfirm={handleEliminarCurso}
        loading={actionLoading}
      />
    </section>
  );
}