import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiSearch, FiUsers, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { getDocentes, createDocente, updateDocente, deleteDocente } from "../../../api/docenteService";
import { registerRequest } from "../../auth/services/authService";
import { ROLES } from "../../../utils/roles";
import { useAuth } from "../../auth/hooks/useAuth";

function DocenteForm({ docente, onClose, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      usuario: {
        nombres: docente?.usuario?.nombres || "",
        apellidos: docente?.usuario?.apellidos || "",
        email: docente?.usuario?.email || "",
        password: "",
      },
      especialidad: docente?.especialidad || "",
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
      {!docente && (
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Contraseña</label>
          <input type="password" className={`w-full rounded-xl border py-2.5 px-4 outline-none transition focus:ring-4 ${errors.usuario?.password ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#012169] focus:ring-blue-100"}`}
            {...register("usuario.password", { required: "Campo obligatorio", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Especialidad</label>
        <input type="text" className="w-full rounded-xl border border-slate-300 py-2.5 px-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          {...register("especialidad")} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
        <button type="submit" disabled={loading} className="rounded-xl bg-[#012169] px-5 py-2.5 font-semibold text-white hover:bg-blue-900 disabled:bg-blue-400">
          {loading ? "Guardando..." : docente ? "Actualizar docente" : "Crear docente"}
        </button>
      </div>
    </form>
  );
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const cargarDocentes = async () => {
    try {
      setLoading(true); setError("");
      const data = await getDocentes();
      setDocentes(data || []);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los docentes.");
    } finally { setLoading(false); }
  };

  useEffect(() => { cargarDocentes(); }, []);

  const filtrados = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return docentes;
    return docentes.filter((d) =>
      `${d.usuario?.nombres} ${d.usuario?.apellidos} ${d.especialidad}`.toLowerCase().includes(term)
    );
  }, [docentes, search]);

  const abrirNuevo = () => { setSuccessMessage(""); setDocenteSeleccionado(null); setModalOpen(true); };

  const abrirEditar = (doc) => { setSuccessMessage(""); setDocenteSeleccionado(doc); setModalOpen(true); };

  const cerrarModal = () => { if (actionLoading) return; setModalOpen(false); setDocenteSeleccionado(null); };

  const handleGuardar = async (data) => {
    try {
      setActionLoading(true); setError("");
      if (docenteSeleccionado) {
        const payload = {
          especialidad: data.especialidad,
          usuario: { nombres: data.usuario.nombres, apellidos: data.usuario.apellidos, email: data.usuario.email }
        };
        await updateDocente(docenteSeleccionado.id, payload);
        setSuccessMessage("Docente actualizado.");
      } else {
        await registerRequest({ ...data.usuario, rol: "DOCENTE" });
        setSuccessMessage("Docente creado.");
      }
      cerrarModal();
      cargarDocentes();
    } catch (err) {
      setError(err.response?.data || "Error al guardar.");
    } finally { setActionLoading(false); }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este docente?")) return;
    try {
      setActionLoading(true);
      await deleteDocente(id);
      setDocentes((prev) => prev.filter((d) => d.id !== id));
      setSuccessMessage("Docente eliminado.");
    } catch (err) {
      setError(err.response?.data || "Error al eliminar.");
    } finally { setActionLoading(false); }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#012169]/10 p-3 text-[#012169]"><FiUsers size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-[#012169]">Gestión de docentes</h1>
            <p className="mt-1 text-slate-600">Administra los docentes registrados en la plataforma.</p>
          </div>
        </div>
        <button onClick={abrirNuevo} className="inline-flex items-center gap-2 rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white hover:bg-blue-900">
          <FiPlus size={20} /> Nuevo docente
        </button>
      </div>

      {successMessage && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div>}
      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar docente..." className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100" />
        </div>
        <button onClick={cargarDocentes} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">
          <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} /> Actualizar
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Nombres</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Apellidos</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Especialidad</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">No hay docentes registrados.</td></tr>
              ) : (
                filtrados.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{doc.usuario?.nombres || "-"}</td>
                    <td className="px-6 py-4 text-slate-700">{doc.usuario?.apellidos || "-"}</td>
                    <td className="px-6 py-4 text-slate-700">{doc.usuario?.email || "-"}</td>
                    <td className="px-6 py-4 text-slate-700">{doc.especialidad || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => abrirEditar(doc)} className="rounded-lg bg-blue-50 px-3 py-1.5 mr-2 text-sm font-semibold text-[#012169] hover:bg-blue-100">
                        <FiEdit2 size={14} className="inline mr-1" />Editar
                      </button>
                      <button onClick={() => handleEliminar(doc.id)} disabled={actionLoading} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                        <FiTrash2 size={14} className="inline mr-1" />Eliminar
                      </button>
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
              {docenteSeleccionado ? "Editar docente" : "Nuevo docente"}
            </h2>
            <DocenteForm docente={docenteSeleccionado} onClose={cerrarModal} onSubmit={handleGuardar} loading={actionLoading} />
          </div>
        </div>
      )}
    </section>
  );
}
