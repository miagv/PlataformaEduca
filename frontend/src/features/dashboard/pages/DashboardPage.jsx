import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiClipboard,
  FiFileText,
  FiUsers,
} from "react-icons/fi";

import { useAuth } from "../../auth/hooks/useAuth";
import LoadingScreen from "../../../common/LoadingScreen";
import ErrorMessage from "../../../common/ErrorMessage";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import CourseAverageChart from "../components/CourseAverageChart";
import GradeDistributionChart from "../components/GradeDistributionChart";
import RecentEvaluations from "../components/RecentEvaluations";
import PerformanceSummary from "../components/PerformanceSummary";

import { getDashboardData } from "../services/dashboardService";
import { getSalones, getCursosPorSalon } from "../../../api/salonService";
import { getEstudiante } from "../../estudiantes/services/estudianteService";
import { getEvaluacionesPorSalon } from "../../evaluaciones/services/evaluacionService";
import { getNotasPorEstudiante } from "../../notas/services/notaService";

import {
  getApprovedPercentage,
  getCourseAverageData,
  getGeneralAverage,
  getGradeDistributionData,
  getRecentEvaluations,
} from "../charts/chartHelpers";

import { ROLES } from "../../../utils/roles";

export default function DashboardPage() {
  const { user } = useAuth();
  const isStudent = user?.rol === ROLES.ESTUDIANTE;

  const [dashboardData, setDashboardData] = useState({
    cursos: [],
    estudiantes: [],
    docentes: [],
    evaluaciones: [],
    notas: [],
  });

  const [studentData, setStudentData] = useState({
    notas: [],
    cursos: [],
    evaluaciones: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salones, setSalones] = useState([]);
  const [salonSeleccionado, setSalonSeleccionado] = useState("");

  useEffect(() => {
    if (isStudent) {
      loadStudentData();
    } else {
      loadDashboardData();
    }
  }, [isStudent]);

  useEffect(() => {
    if (!isStudent) {
      getSalones()
        .then((data) => setSalones(data))
        .catch(() => {});
    }
  }, [isStudent]);

  async function loadStudentData() {
    try {
      setLoading(true);
      setError("");

      const estudianteId = user.estudianteId;
      if (!estudianteId) {
        setStudentData({ notas: [], cursos: [], evaluaciones: [] });
        setLoading(false);
        return;
      }

      const [estudiante, notas] = await Promise.all([
        getEstudiante(estudianteId),
        getNotasPorEstudiante(estudianteId),
      ]);

      const notasValidas = Array.isArray(notas) ? notas : [];

      const salon = estudiante?.salon;
      if (salon?.id) {
        const [cursos, evaluaciones] = await Promise.all([
          getCursosPorSalon(salon.id),
          getEvaluacionesPorSalon(salon.id),
        ]);
        setStudentData({ notas: notasValidas, cursos: cursos || [], evaluaciones: evaluaciones || [] });
      } else {
        setStudentData({ notas: notasValidas, cursos: [], evaluaciones: [] });
      }
    } catch (err) {
      setError(
        err.response?.data ||
          "Error al cargar tus datos."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar los datos del dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  const estudiantesFiltrados = useMemo(() => {
    if (!salonSeleccionado) return dashboardData.estudiantes;
    return dashboardData.estudiantes.filter(
      (e) => e.salon?.id?.toString() === salonSeleccionado
    );
  }, [dashboardData.estudiantes, salonSeleccionado]);

  const notasFiltradas = useMemo(() => {
    if (isStudent) return studentData.notas;
    if (!salonSeleccionado) return dashboardData.notas;
    return dashboardData.notas.filter(
      (nota) =>
        nota.estudiante?.salon?.id?.toString() === salonSeleccionado
    );
  }, [isStudent, studentData.notas, dashboardData.notas, salonSeleccionado]);

  const analytics = useMemo(() => {
    const cursos = isStudent ? studentData.cursos : dashboardData.cursos;
    const evaluaciones = isStudent ? studentData.evaluaciones : dashboardData.evaluaciones;

    const courseAverageData = getCourseAverageData(cursos, notasFiltradas);
    const gradeDistributionData = getGradeDistributionData(notasFiltradas);
    const promedioGeneral = getGeneralAverage(notasFiltradas);
    const porcentajeAprobados = getApprovedPercentage(notasFiltradas);
    const recentEvaluations = getRecentEvaluations(evaluaciones);

    return {
      courseAverageData,
      gradeDistributionData,
      promedioGeneral,
      porcentajeAprobados,
      recentEvaluations,
    };
  }, [isStudent, studentData, dashboardData, notasFiltradas]);

  if (loading) {
    return <LoadingScreen message="Cargando dashboard académico..." />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {!isStudent && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Filtrar por salón:
          </label>
          <select
            value={salonSeleccionado}
            onChange={(e) => setSalonSeleccionado(e.target.value)}
            className="w-full sm:w-56 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#012169] focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Todos los salones</option>
            {salones.map((s) => (
              <option key={s.id} value={s.id}>
                {s.grado} &quot;{s.seccion}&quot;
              </option>
            ))}
          </select>
        </div>
      )}

      <ErrorMessage message={error} />

      {!isStudent && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Cursos activos"
            value={dashboardData.cursos.length}
            description="Cursos registrados en la plataforma"
            icon={FiBookOpen}
            iconClassName="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Estudiantes"
            value={estudiantesFiltrados.length}
            description="Estudiantes registrados"
            icon={FiUsers}
            iconClassName="bg-violet-100 text-violet-600"
          />
          <StatCard
            title="Evaluaciones"
            value={dashboardData.evaluaciones.length}
            description="Evaluaciones creadas"
            icon={FiClipboard}
            iconClassName="bg-amber-100 text-amber-600"
          />
          <StatCard
            title="Notas registradas"
            value={notasFiltradas.length}
            description="Registros académicos disponibles"
            icon={FiFileText}
            iconClassName="bg-emerald-100 text-emerald-600"
          />
        </section>
      )}

      {isStudent && (
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Promedio general"
            value={`${analytics.promedioGeneral} / 20`}
            description="Promedio de tus notas registradas"
            icon={FiBookOpen}
            iconClassName="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Notas aprobadas"
            value={`${analytics.porcentajeAprobados}%`}
            description="Notas iguales o mayores a 11"
            icon={FiClipboard}
            iconClassName="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            title="Evaluaciones"
            value={studentData.evaluaciones.length}
            description="Evaluaciones disponibles para tu salón"
            icon={FiFileText}
            iconClassName="bg-violet-100 text-violet-600"
          />
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <CourseAverageChart data={analytics.courseAverageData} />
        <GradeDistributionChart data={analytics.gradeDistributionData} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RecentEvaluations evaluaciones={analytics.recentEvaluations} />
        <PerformanceSummary
          promedioGeneral={analytics.promedioGeneral}
          porcentajeAprobados={analytics.porcentajeAprobados}
          totalNotas={notasFiltradas.length}
        />
      </section>
    </div>
  );
}