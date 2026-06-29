import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiSend,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";

import { getSalones, getMisSalones } from "../../../api/salonService";
import { updateNota, deleteNota } from "../services/notaService";
import {
  getSolicitudes,
  getMisSolicitudes,
  crearSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
} from "../services/solicitudNotaService";

import NotaModal from "../components/NotaModal";
import SolicitudesTable from "../components/SolicitudesTable";
import SolicitudEdicionModal from "../components/SolicitudEdicionModal";
import { useNotas } from "../hooks/useNotas";

export default function NotasPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === ROLES.ADMIN;
  const isDocente = user?.rol === ROLES.DOCENTE;

  const {
    notas,
    loading,
    actionLoading,
    error,
    cargarNotas,
    guardarNota,
  } = useNotas({ misNotas: isDocente });

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [salones, setSalones] = useState([]);
  const [salonFilter, setSalonFilter] = useState("");

  const [activeTab, setActiveTab] = useState("notas");

  // Solicitudes state
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesLoading, setSolicitudesLoading] = useState(false);
  const [solicitudError, setSolicitudError] = useState("");
  const [solicitudEditModalOpen, setSolicitudEditModalOpen] = useState(false);
  const [notaParaSolicitar, setNotaParaSolicitar] = useState(null);
  const [rechazarModal, setRechazarModal] = useState({ open: false, solicitud: null, motivo: "" });
  const [actionLoadingSol, setActionLoadingSol] = useState(false);

  const canManage = isAdmin || isDocente;
  const canEdit = isAdmin;

  useEffect(() => {
    const loadSalones = isDocente ? getMisSalones : getSalones;
    loadSalones()
      .then((data) => setSalones(data))
      .catch(() => {});
  }, [isDocente]);

  const cargarSolicitudes = async () => {
    try {
      setSolicitudesLoading(true);
      setSolicitudError("");
      const data = isAdmin ? await getSolicitudes() : await getMisSolicitudes();
      setSolicitudes(data);
    } catch {
      setSolicitudError("No se pudieron cargar las solicitudes.");
    } finally {
      setSolicitudesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "solicitudes") {
      cargarSolicitudes();
    }
  }, [activeTab]);

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
    } catch {}
  };

  const handleEditarNota = async (nota) => {
    const nuevaNotaStr = prompt(`Nota actual: ${nota.nota}\nIngrese la nueva nota (0-20):`, nota.nota);
    if (nuevaNotaStr === null) return;
    const nuevaNota = parseFloat(nuevaNotaStr);
    if (isNaN(nuevaNota) || nuevaNota < 0 || nuevaNota > 20) {
      setSolicitudError("La nota debe ser un número entre 0 y 20.");
      return;
    }
    try {
      await updateNota(nota.id, { nota: nuevaNota });
      setSuccessMessage("Nota actualizada correctamente.");
      cargarNotas();
    } catch {
      setSolicitudError("Error al actualizar la nota.");
    }
  };

  const handleEliminarNota = async (nota) => {
    if (!confirm(`¿Eliminar la nota de ${nota.estudiante?.usuario?.nombres}?`)) return;
    try {
      await deleteNota(nota.id);
      setSuccessMessage("Nota eliminada.");
      cargarNotas();
    } catch {
      setSolicitudError("Error al eliminar la nota.");
    }
  };

  const abrirSolicitudEdicion = (nota) => {
    setNotaParaSolicitar(nota);
    setSolicitudEditModalOpen(true);
  };

  const handleEnviarSolicitud = async (data) => {
    try {
      setActionLoadingSol(true);
      await crearSolicitud(data);
      setSolicitudEditModalOpen(false);
      setNotaParaSolicitar(null);
      setSuccessMessage("Solicitud enviada. Espera la respuesta del coordinador.");
    } catch {
      setSolicitudError("Error al enviar la solicitud.");
    } finally {
      setActionLoadingSol(false);
    }
  };

  const handleAprobarSolicitud = async (id) => {
    if (!confirm("¿Aprobar esta solicitud? La nota será actualizada.")) return;
    try {
      setActionLoadingSol(true);
      await aprobarSolicitud(id);
      setSuccessMessage("Solicitud aprobada y nota actualizada.");
      cargarSolicitudes();
      cargarNotas();
    } catch {
      setSolicitudError("Error al aprobar la solicitud.");
    } finally {
      setActionLoadingSol(false);
    }
  };

  const abrirRechazarModal = (solicitud) => {
    setRechazarModal({ open: true, solicitud, motivo: "" });
  };

  const handleRechazarSolicitud = async () => {
    if (!rechazarModal.motivo.trim()) return;
    try {
      setActionLoadingSol(true);
      await rechazarSolicitud(rechazarModal.solicitud.id, rechazarModal.motivo.trim());
      setRechazarModal({ open: false, solicitud: null, motivo: "" });
      setSuccessMessage("Solicitud rechazada.");
      cargarSolicitudes();
    } catch {
      setSolicitudError("Error al rechazar la solicitud.");
    } finally {
      setActionLoadingSol(false);
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

      {solicitudError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {solicitudError}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        <button
          onClick={() => setActiveTab("notas")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            activeTab === "notas" ? "bg-[#012169] text-white" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <FiBookOpen size={16} /> Notas ({notas.length})
        </button>
        {(isAdmin || isDocente) && (
          <button
            onClick={() => setActiveTab("solicitudes")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "solicitudes" ? "bg-[#012169] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <FiSend size={16} /> Solicitudes ({solicitudes.length})
          </button>
        )}
      </div>

      {/* NOTAS TAB */}
      {activeTab === "notas" && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Notas registradas</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{notas.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Promedio general</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{promedioGeneral.toFixed(2)}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Estudiantes aprobados</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{aprobados}</p>
            </article>
          </div>

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
            {canManage && (
              <button
                type="button"
                onClick={abrirModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                <FiPlus size={20} /> Registrar nota
              </button>
            )}
            <button
              type="button"
              onClick={cargarNotas}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} /> Actualizar
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                Cargando notas...
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-4">Estudiante</th>
                        <th className="px-5 py-4">Evaluación</th>
                        <th className="px-5 py-4">Curso</th>
                        <th className="px-5 py-4">Nota</th>
                        <th className="px-5 py-4">Observación</th>
                        <th className="px-5 py-4 text-right">Estado</th>
                        {(isAdmin || isDocente) && <th className="px-5 py-4 text-right">Acciones</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {notasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin || isDocente ? 7 : 6} className="px-5 py-10 text-center text-sm text-slate-500">
                            No hay notas registradas.
                          </td>
                        </tr>
                      ) : (
                        notasFiltradas.map((nota) => {
                          const valorNota = Number(nota.nota || 0);
                          const aprobado = valorNota >= 11;
                          return (
                            <tr key={nota.id} className="hover:bg-slate-50">
                              <td className="px-5 py-4">
                                <p className="font-semibold text-slate-800">
                                  {nota.estudiante?.usuario?.nombres} {nota.estudiante?.usuario?.apellidos}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  Código: {nota.estudiante?.codigo || "Sin código"}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                <p className="font-semibold text-slate-800">{nota.evaluacion?.titulo || "Evaluación no disponible"}</p>
                                <p className="mt-1 text-xs text-slate-400">Peso: {nota.evaluacion?.porcentaje || 0}%</p>
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-600">{nota.evaluacion?.curso?.nombre || "Curso no disponible"}</td>
                              <td className="px-5 py-4">
                                <span className="text-xl font-bold text-slate-900">{valorNota.toFixed(2)}</span>
                                <span className="ml-1 text-sm text-slate-400">/ 20</span>
                              </td>
                              <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                                <p className="line-clamp-2">{nota.observacion || "Sin observación"}</p>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                                    aprobado ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                  }`}>
                                    {aprobado ? "Aprobado" : "Desaprobado"}
                                  </span>
                                </div>
                              </td>
                              {(isAdmin || isDocente) && (
                                <td className="px-5 py-4 text-right">
                                  <div className="flex justify-end gap-1">
                                    {isAdmin && (
                                      <>
                                        <button
                                          onClick={() => handleEditarNota(nota)}
                                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                          title="Editar nota"
                                        >
                                          <FiEdit3 size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleEliminarNota(nota)}
                                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                          title="Eliminar nota"
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </>
                                    )}
                                    {isDocente && (
                                      <button
                                        onClick={() => abrirSolicitudEdicion(nota)}
                                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                                        title="Solicitar edición"
                                      >
                        <FiEdit3 size={16} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* SOLICITUDES TAB */}
      {activeTab === "solicitudes" && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={cargarSolicitudes}
              disabled={solicitudesLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FiRefreshCw className={solicitudesLoading ? "animate-spin" : ""} size={18} /> Actualizar
            </button>
          </div>

          {solicitudesLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Cargando solicitudes...
            </div>
          ) : (
            <SolicitudesTable
              solicitudes={solicitudes}
              isAdmin={isAdmin}
              onAprobar={handleAprobarSolicitud}
              onRechazar={abrirRechazarModal}
              actionLoading={actionLoadingSol}
            />
          )}
        </div>
      )}

      {/* Registrar Nota Modal */}
      <NotaModal
        open={modalOpen}
        salones={salones}
        onClose={cerrarModal}
        onSubmit={handleGuardarNota}
        loading={actionLoading}
      />

      {/* Solicitar Edición Modal */}
      <SolicitudEdicionModal
        open={solicitudEditModalOpen}
        nota={notaParaSolicitar}
        onClose={() => { setSolicitudEditModalOpen(false); setNotaParaSolicitar(null); }}
        onSubmit={handleEnviarSolicitud}
        loading={actionLoadingSol}
      />

      {/* Rechazar Solicitud Modal */}
      {rechazarModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Cerrar" onClick={() => setRechazarModal({ ...rechazarModal, open: false })} className="absolute inset-0 bg-slate-950/60" />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <FiX className="text-red-600" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Rechazar solicitud</h2>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Rechazando solicitud para <strong>{rechazarModal.solicitud.nota?.estudiante?.usuario?.nombres} {rechazarModal.solicitud.nota?.estudiante?.usuario?.apellidos}</strong>
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Motivo del rechazo</label>
              <textarea
                rows="3"
                value={rechazarModal.motivo}
                onChange={(e) => setRechazarModal({ ...rechazarModal, motivo: e.target.value })}
                placeholder="Indica por qué se rechaza la solicitud..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setRechazarModal({ ...rechazarModal, open: false })} disabled={actionLoadingSol} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRechazarSolicitud}
                disabled={actionLoadingSol || !rechazarModal.motivo.trim()}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-400"
              >
                {actionLoadingSol ? "Rechazando..." : "Rechazar solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}