import { useEffect, useMemo, useState, useCallback } from "react";
import { FiCheckCircle, FiXCircle, FiCalendar, FiUsers, FiSave, FiRefreshCw, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROLES } from "../../../utils/roles";
import { getSalones, getMisSalones } from "../../../api/salonService";
import { getEstudiantesPorSalon } from "../../estudiantes/services/estudianteService";
import { tomarAsistencia, getAsistencias, getEstadisticas, verificarAsistencia } from "../services/asistenciaService";

const GRADOS = ["1ro", "2do", "3ro", "4to", "5to", "6to"];

export default function AsistenciasPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === ROLES.ADMIN;

  const [salones, setSalones] = useState([]);
  const [salonId, setSalonId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [yaTomada, setYaTomada] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [gradoFilter, setGradoFilter] = useState("");

  const cargarSalones = useCallback(async () => {
    try {
      const data = isAdmin ? await getSalones() : await getMisSalones();
      setSalones(data);
    } catch (_) {}
  }, [isAdmin]);

  useEffect(() => { cargarSalones(); }, [cargarSalones]);

  const salonesFiltrados = useMemo(() => {
    if (!gradoFilter) return salones;
    return salones.filter((s) => s.grado === gradoFilter);
  }, [salones, gradoFilter]);

  const cargarEstudiantes = useCallback(async () => {
    if (!salonId) return;
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const data = await getEstudiantesPorSalon(parseInt(salonId));
      setEstudiantes(data);

      const verificacion = await verificarAsistencia(parseInt(salonId), fecha);
      setYaTomada(verificacion.tomada);

      if (verificacion.tomada) {
        const asistenciasData = await getAsistencias(parseInt(salonId), fecha);
        const map = {};
        asistenciasData.forEach((a) => {
          if (a.presente !== null) {
            map[a.estudianteId] = a.presente;
          }
        });
        setAsistencias(map);
      } else {
        const defaults = {};
        data.forEach((e) => { defaults[e.id] = true; });
        setAsistencias(defaults);
      }
    } catch (err) {
      setError("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  }, [salonId, fecha]);

  useEffect(() => {
    if (salonId && fecha) {
      cargarEstudiantes();
    }
  }, [salonId, fecha, cargarEstudiantes]);

  const cargarEstadisticas = async () => {
    if (!salonId || !fecha) return;
    try {
      const data = await getEstadisticas(parseInt(salonId), fecha, fecha);
      setStats(data);
    } catch (_) {
      setStats(null);
    }
  };

  useEffect(() => {
    if (yaTomada && salonId && fecha) {
      cargarEstadisticas();
    } else {
      setStats(null);
    }
  }, [yaTomada, salonId, fecha]);

  const toggleAsistencia = (estudianteId) => {
    if (yaTomada) return;
    setAsistencias((prev) => ({ ...prev, [estudianteId]: !prev[estudianteId] }));
  };

  const handleGuardar = async () => {
    if (yaTomada || !salonId) return;
    try {
      setSaving(true);
      setError("");
      const payload = estudiantes.map((e) => ({
        estudianteId: e.id,
        presente: asistencias[e.id] ?? true,
      }));
      await tomarAsistencia(parseInt(salonId), fecha, payload);
      setSuccessMessage("Asistencia registrada correctamente.");
      setYaTomada(true);
      cargarEstadisticas();
    } catch (err) {
      setError(err.response?.data || "Error al guardar asistencia.");
    } finally {
      setSaving(false);
    }
  };

  const totalEstudiantes = estudiantes.length;
  const presentes = estudiantes.filter((e) => asistencias[e.id] === true).length;
  const ausentes = estudiantes.filter((e) => asistencias[e.id] === false).length;
  const sinMarca = estudiantes.filter((e) => asistencias[e.id] === undefined || asistencias[e.id] === null).length;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#012169]/10 p-3 text-[#012169]"><FiCalendar size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold text-[#012169]">Control de asistencia</h1>
            <p className="mt-1 text-slate-600">
              {isAdmin ? "Visualiza las asistencias registradas por los docentes." : "Registra la asistencia diaria de tus estudiantes."}
            </p>
          </div>
        </div>
      </div>

      {successMessage && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div>}
      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Salón</label>
          {isAdmin && (
            <select
              value={gradoFilter}
              onChange={(e) => setGradoFilter(e.target.value)}
              className="mb-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Todos los grados</option>
              {GRADOS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          )}
          <select
            value={salonId}
            onChange={(e) => setSalonId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Seleccionar salón</option>
            {salonesFiltrados.map((s) => (
              <option key={s.id} value={s.id}>{s.grado} &quot;{s.seccion}&quot;</option>
            ))}
          </select>
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-end">
          <button onClick={cargarEstudiantes} disabled={loading || !salonId} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} /> Cargar
          </button>
        </div>
      </div>

      {salonId && estudiantes.length > 0 && (
        <>
          {!yaTomada && !isAdmin && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-medium text-amber-700">
              <FiCalendar size={18} />
              Asistencia no tomada aún. Marca los estudiantes y guarda.
            </div>
          )}

          {yaTomada && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
              <FiCheckCircle size={18} />
              Asistencia registrada para esta fecha.
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Código</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Estudiante</th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                    {!yaTomada && !isAdmin && <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Acción</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estudiantes.map((est) => (
                    <tr key={est.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-800">{est.codigo || "-"}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {est.usuario?.nombres} {est.usuario?.apellidos}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {asistencias[est.id] === true && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <FiCheckCircle size={14} /> Presente
                          </span>
                        )}
                        {asistencias[est.id] === false && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            <FiXCircle size={14} /> Ausente
                          </span>
                        )}
                        {(asistencias[est.id] === undefined || asistencias[est.id] === null) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400">
                            Sin marca
                          </span>
                        )}
                      </td>
                      {!yaTomada && !isAdmin && (
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleAsistencia(est.id)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                              asistencias[est.id] !== false
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {asistencias[est.id] !== false ? "Marcar ausente" : "Marcar presente"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {!isAdmin && (
              <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                <span className="text-emerald-600"><FiCheckCircle size={16} className="inline mr-1" />Presentes: {presentes}</span>
                <span className="text-red-600"><FiXCircle size={16} className="inline mr-1" />Ausentes: {ausentes}</span>
                {sinMarca > 0 && <span className="text-slate-400">Sin marca: {sinMarca}</span>}
                <span>Total: {totalEstudiantes}</span>
              </div>
            )}

            {!yaTomada && !isAdmin && (
              <button
                onClick={handleGuardar}
                disabled={saving || !salonId}
                className="inline-flex items-center gap-2 rounded-xl bg-[#012169] px-6 py-3 font-semibold text-white hover:bg-blue-900 disabled:bg-blue-400"
              >
                <FiSave size={18} />
                {saving ? "Guardando..." : "Guardar asistencia"}
              </button>
            )}
          </div>

          {stats && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <FiBarChart2 size={20} /> Resumen de asistencia
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">{stats.totalRegistros}</p>
                  <p className="text-xs font-semibold text-slate-500">Total registros</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{stats.presentes}</p>
                  <p className="text-xs font-semibold text-emerald-600">Presentes</p>
                </div>
                <div className="rounded-xl bg-red-50 p-4 text-center">
                  <p className="text-2xl font-bold text-red-700">{stats.ausentes}</p>
                  <p className="text-xs font-semibold text-red-600">Ausentes</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-4 text-center">
                  <p className="text-2xl font-bold text-[#012169]">{stats.porcentajeAsistencia}%</p>
                  <p className="text-xs font-semibold text-blue-600">% Asistencia</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {salonId && !loading && estudiantes.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <FiUsers size={48} className="mx-auto text-slate-300" />
          <p className="mt-4 text-sm text-slate-500">No hay estudiantes en este salón.</p>
        </div>
      )}
    </section>
  );
}
