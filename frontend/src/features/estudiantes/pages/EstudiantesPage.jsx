import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiSearch, FiUsers, FiUserCheck } from "react-icons/fi";
import { useForm } from "react-hook-form";
import axiosClient from "../../../api/axiosClient";
import { registerRequest } from "../../auth/services/authService";
import { getSalones, getMisSalones, getEstudiantesSinSalon, asignarSalonAEstudiante } from "../../../api/salonService";
import { getMisEstudiantes } from "../services/estudianteService";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";

function EstudianteForm({ estudiante, onClose, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      codigo: estudiante?.codigo || "",
      usuario: {
        nombres: estudiante?.usuario?.nombres || "",
        apellidos: estudiante?.usuario?.apellidos || "",
        email: estudiante?.usuario?.email || "",
        password: "",
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Nombres</label>
          <input type="text" className={`w-full rounded-xl border py-2.5 px-4 outline-none transition focus:ring-4 ${errors.usuario?.nombres ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"}`}
            {...register("usuario.nombres", { required: "Campo obligatorio" })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Apellidos</label>
          <input type="text" className={`w-full rounded-xl border py-2.5 px-4 outline-none transition focus:ring-4 ${errors.usuario?.apellidos ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"}`}
            {...register("usuario.apellidos", { required: "Campo obligatorio" })} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
        <input type="email" className={`w-full rounded-xl border py-2.5 px-4 outline-none transition focus:ring-4 ${errors.usuario?.email ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"}`}
          {...register("usuario.email", { required: "Campo obligatorio" })} />
      </div>
      {!estudiante && (
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Contraseña</label>
          <input type="password" className={`w-full rounded-xl border py-2.5 px-4 outline-none transition focus:ring-4 ${errors.usuario?.password ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"}`}
            {...register("usuario.password", { required: "Campo obligatorio", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
        <button type="submit" disabled={loading} className="rounded-xl bg-[#012169] px-5 py-2.5 font-semibold text-white hover:bg-blue-900 disabled:bg-blue-400">
          {loading ? "Guardando..." : estudiante ? "Actualizar" : "Crear estudiante"}
        </button>
      </div>
    </form>
  );
}

export default function EstudiantesPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === ROLES.ADMIN;
  const isDocente = user?.rol === ROLES.DOCENTE;

  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [activeTab, setActiveTab] = useState("todos");
  const [sinSalon, setSinSalon] = useState([]);
  const [salones, setSalones] = useState([]);
  const [asignarModal, setAsignarModal] = useState({ open: false, estudiante: null, salonId: "" });
  const [salonFilter, setSalonFilter] = useState("");

  const cargarEstudiantes = async () => {
    try {
      setLoading(true); setError("");
      let data;
      if (isDocente) {
        data = await getMisEstudiantes();
      } else {
        const res = await axiosClient.get("/estudiantes");
        data = res.data || [];
      }
      setEstudiantes(data);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los estudiantes.");
    } finally { setLoading(false); }
  };

  const cargarSinSalon = async () => {
    try {
      const data = await getEstudiantesSinSalon();
      setSinSalon(data);
    } catch (_) {}
  };

  const cargarSalones = async () => {
    try {
      const data = isAdmin ? await getSalones() : await getMisSalones();
      setSalones(data);
    } catch (_) {}
  };

  useEffect(() => {
    cargarEstudiantes();
    if (isAdmin) cargarSinSalon();
    cargarSalones();
  }, []);

  const filtrados = useMemo(() => {
    const term = search.toLowerCase().trim();
    let result = estudiantes;

    if (term) {
      result = result.filter((e) =>
        `${e.usuario?.nombres} ${e.usuario?.apellidos} ${e.codigo}`.toLowerCase().includes(term)
      );
    }

    if (salonFilter) {
      result = result.filter((e) => e.salon?.id === parseInt(salonFilter));
    }

    return result;
  }, [estudiantes, search, salonFilter]);

  const abrirNuevo = () => { setSuccessMessage(""); setEstudianteSeleccionado(null); setModalOpen(true); };
  const cerrarModal = () => { if (actionLoading) return; setModalOpen(false); setEstudianteSeleccionado(null); };

  const handleGuardar = async (data) => {
    try {
      setActionLoading(true); setError("");
      if (estudianteSeleccionado) {
        await axiosClient.put(`/estudiantes/${estudianteSeleccionado.id}`, data);
        setSuccessMessage("Estudiante actualizado.");
      } else {
        await registerRequest({ ...data.usuario, rol: "ESTUDIANTE" });
        setSuccessMessage("Estudiante creado.");
      }
      cerrarModal();
      cargarEstudiantes();
      if (isAdmin) cargarSinSalon();
    } catch (err) {
      setError(err.response?.data || "Error al guardar.");
    } finally { setActionLoading(false); }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este estudiante?")) return;
    try {
      setActionLoading(true);
      await axiosClient.delete(`/estudiantes/${id}`);
      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
      setSinSalon((prev) => prev.filter((e) => e.id !== id));
      setSuccessMessage("Estudiante eliminado.");
    } catch (err) {
      setError(err.response?.data || "Error al eliminar.");
    } finally { setActionLoading(false); }
  };

  const abrirAsignar = async (est) => {
    await cargarSalones();
    setAsignarModal({ open: true, estudiante: est, salonId: "" });
  };

  const handleAsignarSalon = async () => {
    if (!asignarModal.salonId) return;
    try {
      setActionLoading(true);
      await asignarSalonAEstudiante(asignarModal.estudiante.id, parseInt(asignarModal.salonId));
      setAsignarModal({ open: false, estudiante: null, salonId: "" });
      setSuccessMessage("Estudiante asignado al salón.");
      cargarSinSalon();
      cargarEstudiantes();
    } catch (err) {
      setError("Error al asignar salón");
    } finally { setActionLoading(false); }
  };

  const showData = isAdmin && activeTab === "sinSalon" ? sinSalon : filtrados;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#012169]/10 p-3 text-[#012169]"><FiUsers size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-[#012169]">Gestión de estudiantes</h1>
            <p className="mt-1 text-slate-600">Administra los estudiantes registrados en la plataforma.</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={abrirNuevo} className="inline-flex items-center gap-2 rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white hover:bg-blue-900">
            <FiPlus size={20} /> Nuevo estudiante
          </button>
        )}
      </div>

      {successMessage && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div>}
      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      {/* Tabs — only for ADMIN */}
      {isAdmin && (
        <div className="mt-6 flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
          <button onClick={() => setActiveTab("todos")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === "todos" ? "bg-[#012169] text-white" : "text-slate-500 hover:bg-slate-100"}`}>
            <FiUserCheck size={16} /> Todos ({estudiantes.length})
          </button>
          <button onClick={() => { setActiveTab("sinSalon"); cargarSinSalon(); }} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === "sinSalon" ? "bg-[#012169] text-white" : "text-slate-500 hover:bg-slate-100"}`}>
            <FiUsers size={16} /> Nuevos sin salón ({sinSalon.length})
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar estudiante..." className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100" />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={salonFilter}
            onChange={(e) => setSalonFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Todos los salones</option>
            {salones.map((s) => (
              <option key={s.id} value={s.id}>{s.grado} &quot;{s.seccion}&quot;</option>
            ))}
          </select>
          <button onClick={cargarEstudiantes} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} /> Actualizar
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Código</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Nombres</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Apellidos</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Salón</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {showData.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                  {isAdmin && activeTab === "todos" ? "No hay estudiantes registrados." : isAdmin && activeTab === "sinSalon" ? "No hay estudiantes sin salón." : "No hay estudiantes en tus salones."}
                </td></tr>
              ) : (
                showData.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-800">{est.codigo || "-"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{est.usuario?.nombres || "-"}</td>
                    <td className="px-6 py-4 text-slate-700">{est.usuario?.apellidos || "-"}</td>
                    <td className="px-6 py-4 text-slate-700">{est.usuario?.email || "-"}</td>
                    <td className="px-6 py-4">
                      {est.salon ? (
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#012169]">
                          {est.salon.grado} "{est.salon.seccion}"
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Sin salón</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!est.salon && isAdmin && activeTab === "sinSalon" && (
                        <button onClick={() => abrirAsignar(est)} disabled={actionLoading} className="rounded-lg bg-[#012169]/10 px-3 py-1.5 mr-2 text-sm font-semibold text-[#012169] hover:bg-[#012169]/20 disabled:opacity-50">
                          Asignar salón
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleEliminar(est.id)} disabled={actionLoading} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              {estudianteSeleccionado ? "Editar estudiante" : "Nuevo estudiante"}
            </h2>
            <EstudianteForm estudiante={estudianteSeleccionado} onClose={cerrarModal} onSubmit={handleGuardar} loading={actionLoading} />
          </div>
        </div>
      )}

      {asignarModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setAsignarModal({ ...asignarModal, open: false })}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Asignar salón a {asignarModal.estudiante.usuario?.nombres}</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Salón</label>
                <select
                  value={asignarModal.salonId}
                  onChange={(e) => setAsignarModal({ ...asignarModal, salonId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Seleccionar salón</option>
                  {salones.map((s) => (
                    <option key={s.id} value={s.id}>{s.grado} &quot;{s.seccion}&quot;</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setAsignarModal({ ...asignarModal, open: false })} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleAsignarSalon} disabled={actionLoading || !asignarModal.salonId} className="rounded-xl bg-[#012169] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:bg-blue-400">Asignar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}