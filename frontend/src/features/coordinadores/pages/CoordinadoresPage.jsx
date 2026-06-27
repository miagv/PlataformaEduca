import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiShield, FiRefreshCw } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { registerRequest, getCoordinadores } from "../../auth/services/authService";
import axiosClient from "../../../api/axiosClient";

function CoordinadorForm({ onClose, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Nombres</label>
          <input type="text" className="w-full rounded-xl border border-slate-300 py-2.5 px-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
            {...register("usuario.nombres", { required: true })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Apellidos</label>
          <input type="text" className="w-full rounded-xl border border-slate-300 py-2.5 px-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
            {...register("usuario.apellidos", { required: true })} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
        <input type="email" className="w-full rounded-xl border border-slate-300 py-2.5 px-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          {...register("usuario.email", { required: true })} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Contraseña</label>
        <input type="password" className="w-full rounded-xl border border-slate-300 py-2.5 px-4 outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          {...register("usuario.password", { required: true, minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
        <button type="submit" disabled={loading} className="rounded-xl bg-[#012169] px-5 py-2.5 font-semibold text-white hover:bg-blue-900 disabled:bg-blue-400">
          {loading ? "Creando..." : "Crear coordinador"}
        </button>
      </div>
    </form>
  );
}

export default function CoordinadoresPage() {
  const [coordinadores, setCoordinadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const cargarCoordinadores = async () => {
    try {
      setLoading(true); setError("");
      const data = await getCoordinadores();
      setCoordinadores(data || []);
    } catch (err) {
      setError("Error al cargar coordinadores");
    } finally { setLoading(false); }
  };

  useEffect(() => { cargarCoordinadores(); }, []);

  const handleGuardar = async (data) => {
    try {
      setActionLoading(true); setError("");
      await registerRequest({ ...data.usuario, rol: "ADMIN" });
      setSuccessMessage("Coordinador creado exitosamente.");
      setModalOpen(false);
      cargarCoordinadores();
    } catch (err) {
      setError(err.response?.data || "Error al crear coordinador.");
    } finally { setActionLoading(false); }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este coordinador?")) return;
    try {
      setActionLoading(true);
      await axiosClient.delete(`/usuarios/${id}`);
      setCoordinadores((prev) => prev.filter((c) => c.id !== id));
      setSuccessMessage("Coordinador eliminado.");
    } catch (err) {
      setError("Error al eliminar coordinador");
    } finally { setActionLoading(false); }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#012169]/10 p-3 text-[#012169]"><FiShield size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-[#012169]">Gestión de coordinadores</h1>
            <p className="mt-1 text-slate-600">Administra los coordinadores del sistema.</p>
          </div>
        </div>
        <button onClick={() => { setSuccessMessage(""); setModalOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#012169] px-5 py-3 font-semibold text-white hover:bg-blue-900">
          <FiPlus size={20} /> Nuevo coordinador
        </button>
      </div>

      {successMessage && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div>}
      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Nombres</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Apellidos</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coordinadores.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-800">{c.nombres}</td>
                  <td className="px-6 py-4 text-slate-700">{c.apellidos}</td>
                  <td className="px-6 py-4 text-slate-700">{c.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEliminar(c.id)} disabled={actionLoading} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                      <FiTrash2 size={14} className="inline mr-1" />Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {coordinadores.length === 0 && !loading && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">No hay coordinadores registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-bold text-slate-900">Nuevo coordinador</h2>
            <CoordinadorForm onClose={() => setModalOpen(false)} onSubmit={handleGuardar} loading={actionLoading} />
          </div>
        </div>
      )}
    </section>
  );
}
