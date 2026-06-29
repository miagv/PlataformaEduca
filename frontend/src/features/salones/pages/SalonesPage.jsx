import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiUsers, FiBarChart2, FiPrinter, FiChevronLeft, FiDownload } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";
import { getSalones, getMisSalones, createSalon, updateSalon, deleteSalon, getDocentesPorSalon, createCargaHoraria, updateCargaHoraria, deleteCargaHoraria, getReporteSalon, getReporteMisCursos } from "../../../api/salonService";
import { getCursos } from "../../cursos/services/cursoService";
import { getDocentes } from "../../../api/docenteService";
import { getEstudiantesPorSalon } from "../../estudiantes/services/estudianteService";
import LoadingScreen from "../../../common/LoadingScreen";
import ErrorMessage from "../../../common/ErrorMessage";
import html2pdf from "html2pdf.js";

export default function SalonesPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === ROLES.ADMIN;

  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSalon, setEditingSalon] = useState(null);
  const [salonForm, setSalonForm] = useState({ grado: "", seccion: "", activo: true });

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [activeTab, setActiveTab] = useState("docentes");
  const [docentesAsignados, setDocentesAsignados] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(false);

  const [showCHModal, setShowCHModal] = useState(false);
  const [editingCH, setEditingCH] = useState(null);
  const [chForm, setChForm] = useState({ docenteId: "", cursoId: "", horasSemanales: "" });
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);

  const [reporte, setReporte] = useState(null);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const cargarSalones = useCallback(async () => {
    try {
      setLoading(true);
      const data = isAdmin ? await getSalones() : await getMisSalones();
      setSalones(data);
    } catch (err) {
      setError("Error al cargar salones");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { cargarSalones(); }, [cargarSalones]);

  const cargarDocentesAsignados = async (salonId) => {
    try {
      setLoadingDocentes(true);
      const data = await getDocentesPorSalon(salonId);
      setDocentesAsignados(data);
    } catch (err) {
      setDocentesAsignados([]);
    } finally {
      setLoadingDocentes(false);
    }
  };

  const cargarReporte = async (salonId) => {
    try {
      setLoadingReporte(true);
      const data = isAdmin ? await getReporteSalon(salonId) : await getReporteMisCursos(salonId);
      setReporte(data);
    } catch (err) {
      setReporte(null);
    } finally {
      setLoadingReporte(false);
    }
  };

  const handleSelectSalon = async (salon) => {
    setSelectedSalon(salon);
    setActiveTab("docentes");
    setReporte(null);
    cargarDocentesAsignados(salon.id);
  };

  const handleBack = () => {
    setSelectedSalon(null);
    setReporte(null);
  };

  const openCreateModal = () => {
    setEditingSalon(null);
    setSalonForm({ grado: "", seccion: "", activo: true });
    setShowModal(true);
  };

  const openEditModal = (salon) => {
    setEditingSalon(salon);
    setSalonForm({ grado: salon.grado, seccion: salon.seccion, activo: salon.activo });
    setShowModal(true);
  };

  const handleSaveSalon = async () => {
    try {
      if (editingSalon) {
        await updateSalon(editingSalon.id, salonForm);
      } else {
        await createSalon(salonForm);
      }
      setShowModal(false);
      await cargarSalones();
    } catch (err) {
      setError("Error al guardar salón");
    }
  };

  const handleDeleteSalon = async (id) => {
    if (!confirm("¿Eliminar este salón?")) return;
    try {
      await deleteSalon(id);
      if (selectedSalon?.id === id) setSelectedSalon(null);
      await cargarSalones();
    } catch (err) {
      setError("Error al eliminar salón");
    }
  };

  const openCreateCHModal = async () => {
    setEditingCH(null);
    setChForm({ docenteId: "", cursoId: "", horasSemanales: "" });
    try {
      const [cursosData, docentesData] = await Promise.all([getCursos(), getDocentes()]);
      setCursos(cursosData);
      setDocentes(docentesData);
    } catch (_) {}
    setShowCHModal(true);
  };

  const openEditCHModal = async (asignacion) => {
    setEditingCH(asignacion);
    setChForm({
      docenteId: asignacion.docente?.id?.toString() || "",
      cursoId: asignacion.curso?.id?.toString() || "",
      horasSemanales: asignacion.horasSemanales?.toString() || "",
    });
    try {
      const [cursosData, docentesData] = await Promise.all([getCursos(), getDocentes()]);
      setCursos(cursosData);
      setDocentes(docentesData);
    } catch (_) {}
    setShowCHModal(true);
  };

  const handleSaveCH = async () => {
    try {
      if (editingCH) {
        await updateCargaHoraria(editingCH.id, {
          cursoId: parseInt(chForm.cursoId),
          horasSemanales: parseInt(chForm.horasSemanales),
        });
      } else {
        await createCargaHoraria(selectedSalon.id, {
          docenteId: parseInt(chForm.docenteId),
          cursoId: parseInt(chForm.cursoId),
          horasSemanales: parseInt(chForm.horasSemanales),
        });
      }
      setShowCHModal(false);
      cargarDocentesAsignados(selectedSalon.id);
    } catch (err) {
      setError("Error al guardar carga horaria");
    }
  };

  const handleDeleteCH = async (chId) => {
    if (!confirm("¿Eliminar esta asignación?")) return;
    try {
      await deleteCargaHoraria(chId);
      cargarDocentesAsignados(selectedSalon.id);
    } catch (err) {
      setError("Error al eliminar carga horaria");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "reporte" && !reporte) {
      cargarReporte(selectedSalon.id);
    }
  };

  const generatePdf = async () => {
    if (!reporte) await cargarReporte(selectedSalon.id);
    setGeneratingPdf(true);
    setTimeout(async () => {
      const element = document.getElementById("reporte-content");
      if (!element) { setGeneratingPdf(false); return; }
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `reporte-${selectedSalon.grado}-${selectedSalon.seccion}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
      setGeneratingPdf(false);
    }, 500);
  };

  if (loading) return <LoadingScreen message="Cargando salones..." />;

  if (selectedSalon) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50">
            <FiChevronLeft className="text-slate-600" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#012169]">
              Salón {selectedSalon.grado} &quot;{selectedSalon.seccion}&quot;
            </h1>
            <p className="text-sm text-slate-500">Gestiona docentes, estudiantes y reportes del salón</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
          {[
            { id: "docentes", label: "Docentes", icon: FiBook },
            { id: "estudiantes", label: "Estudiantes", icon: FiUsers },
            { id: "reporte", label: "Reporte", icon: FiBarChart2 },
          ].map((tab) => (
            <button key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.id ? "bg-[#012169] text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "docentes" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Docentes asignados</h2>
              {isAdmin && (
                <button onClick={openCreateCHModal} className="inline-flex items-center gap-2 rounded-xl bg-[#012169] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900">
                  <FiPlus size={16} /> Asignar docente
                </button>
              )}
            </div>
            {loadingDocentes ? (
              <LoadingScreen message="Cargando..." />
            ) : docentesAsignados.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No hay docentes asignados a este salón</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
                      <th className="pb-3 pr-4">Docente</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Curso</th>
                      <th className="pb-3 pr-4">Horas/semana</th>
                      {isAdmin && <th className="pb-3 text-right">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {docentesAsignados.map((asig) => (
                      <tr key={asig.id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {asig.docente?.nombres} {asig.docente?.apellidos}
                        </td>
                        <td className="py-3 pr-4 text-slate-500">{asig.docente?.email}</td>
                        <td className="py-3 pr-4 text-slate-700">{asig.curso?.nombre}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-[#012169]">
                            {asig.horasSemanales}h
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="py-3 text-right">
                            <button onClick={() => openEditCHModal(asig)} className="mr-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#012169]">
                              <FiEdit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteCH(asig.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "estudiantes" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Estudiantes del salón</h2>
            <EstudiantesSalonTable salonId={selectedSalon.id} />
          </div>
        )}

        {activeTab === "reporte" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={generatePdf}
                disabled={generatingPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-400"
              >
                <FiDownload size={16} />
                {generatingPdf ? "Generando PDF..." : "Exportar PDF"}
              </button>
            </div>

            <div id="reporte-content" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              {loadingReporte ? (
                <LoadingScreen message="Cargando reporte..." />
              ) : reporte ? (
                <ReporteContenido reporte={reporte} />
              ) : (
                <p className="text-sm text-slate-500 py-4 text-center">No hay datos disponibles para el reporte</p>
              )}
            </div>
          </div>
        )}

        {/* Carga Horaria Modal */}
        {showCHModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCHModal(false)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {editingCH ? "Editar carga horaria" : "Asignar docente al salón"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Docente</label>
                  <select
                    value={chForm.docenteId}
                    onChange={(e) => setChForm({ ...chForm, docenteId: e.target.value })}
                    disabled={!!editingCH}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Seleccionar docente</option>
                    {docentes.map((d) => (
                      <option key={d.id} value={d.id}>{d.usuario?.nombres} {d.usuario?.apellidos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Curso</label>
                  <select
                    value={chForm.cursoId}
                    onChange={(e) => setChForm({ ...chForm, cursoId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Seleccionar curso</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Horas semanales</label>
                  <input
                    type="number" min="1" max="40"
                    value={chForm.horasSemanales}
                    onChange={(e) => setChForm({ ...chForm, horasSemanales: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowCHModal(false)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancelar
                </button>
                <button onClick={handleSaveCH} className="rounded-xl bg-[#012169] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900">
                  {editingCH ? "Guardar cambios" : "Asignar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
      </div>
    );
  }

  // Main list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#012169]">Gestión de salones</h1>
          <p className="text-sm text-slate-500">Administra los salones y asigna docentes</p>
        </div>
        {isAdmin && (
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-xl bg-[#012169] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900">
            <FiPlus size={18} /> Nuevo salón
          </button>
        )}
      </div>

      {salones.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No hay salones registrados</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salones.map((salon) => (
            <button
              key={salon.id}
              onClick={() => handleSelectSalon(salon)}
              className="group rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#012169] text-white font-bold text-lg">
                  {salon.grado?.charAt(0)}{salon.seccion}
                </div>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openEditModal(salon)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#012169]">
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => handleDeleteSalon(salon.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{salon.grado} &quot;{salon.seccion}&quot;</h3>
              <p className="mt-1 text-xs text-slate-500">{salon.activo ? "Activo" : "Inactivo"}</p>
            </button>
          ))}
        </div>
      )}

      {/* Salon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingSalon ? "Editar salón" : "Nuevo salón"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Grado</label>
                <input
                  type="text" placeholder="Ej: Primero, Segundo, 1ro"
                  value={salonForm.grado}
                  onChange={(e) => setSalonForm({ ...salonForm, grado: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Sección</label>
                <input
                  type="text" placeholder="Ej: A, B, C"
                  value={salonForm.seccion}
                  onChange={(e) => setSalonForm({ ...salonForm, seccion: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="activo"
                  checked={salonForm.activo}
                  onChange={(e) => setSalonForm({ ...salonForm, activo: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-[#012169]"
                />
                <label htmlFor="activo" className="text-sm font-medium text-slate-700">Activo</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancelar
              </button>
              <button onClick={handleSaveSalon} className="rounded-xl bg-[#012169] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900">
                {editingSalon ? "Guardar cambios" : "Crear salón"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onClose={() => setError("")} />}
    </div>
  );
}

function EstudiantesSalonTable({ salonId }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEstudiantesPorSalon(salonId);
        setEstudiantes(data);
      } catch (_) {
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [salonId]);

  if (loading) return <LoadingScreen message="Cargando..." />;
  if (estudiantes.length === 0) return <p className="text-sm text-slate-500 py-4 text-center">No hay estudiantes en este salón</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
            <th className="pb-3 pr-4">Código</th>
            <th className="pb-3 pr-4">Nombres</th>
            <th className="pb-3 pr-4">Apellidos</th>
            <th className="pb-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est) => (
            <tr key={est.id} className="border-b border-slate-100">
              <td className="py-3 pr-4 font-mono text-xs text-slate-500">{est.codigo}</td>
              <td className="py-3 pr-4 font-medium text-slate-900">{est.usuario?.nombres}</td>
              <td className="py-3 pr-4 text-slate-700">{est.usuario?.apellidos}</td>
              <td className="py-3 text-slate-500">{est.usuario?.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReporteContenido({ reporte }) {
  return (
    <div className="space-y-6" id="reporte-content-inner">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#012169]">Reporte - Salón {reporte.salonNombre}</h2>
        <p className="text-sm text-slate-500">Grado: {reporte.grado} | Sección: {reporte.seccion}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-2xl font-bold text-[#012169]">{reporte.totalEstudiantes}</p>
          <p className="text-xs text-slate-500">Estudiantes</p>
        </div>
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{reporte.promedioGeneral}</p>
          <p className="text-xs text-slate-500">Promedio general</p>
        </div>
        <div className="rounded-xl bg-purple-50 p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{reporte.porcentajeAprobados}%</p>
          <p className="text-xs text-slate-500">Aprobados</p>
        </div>
      </div>

      {reporte.docentes?.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Docentes asignados</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
                <th className="pb-2 pr-4">Docente</th>
                <th className="pb-2 pr-4">Curso</th>
                <th className="pb-2">Horas</th>
              </tr>
            </thead>
            <tbody>
              {reporte.docentes.map((d) => (
                <tr key={d.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{d.docente?.nombres} {d.docente?.apellidos}</td>
                  <td className="py-2 pr-4">{d.curso?.nombre}</td>
                  <td className="py-2">{d.horasSemanales}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(reporte.promedioPorCurso || {}).length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Rendimiento por curso</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
                <th className="pb-2 pr-4">Curso</th>
                <th className="pb-2 pr-4">Promedio</th>
                <th className="pb-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reporte.promedioPorCurso).map(([curso, promedio]) => (
                <tr key={curso} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">{curso}</td>
                  <td className="py-2 pr-4">{promedio}</td>
                  <td className="py-2">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${promedio >= 11 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {promedio >= 11 ? "Aprobado" : "En riesgo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(reporte.distribucionNotas || {}).length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Distribución de notas</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
                <th className="pb-2 pr-4">Rango</th>
                <th className="pb-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reporte.distribucionNotas).map(([rango, cantidad]) => (
                <tr key={rango} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{rango}</td>
                  <td className="py-2 font-semibold">{cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
