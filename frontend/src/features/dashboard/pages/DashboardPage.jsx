import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiClipboard,
  FiFileText,
  FiUsers,
} from "react-icons/fi";

import { useAuth } from "../../auth/hooks/useAuth";
import LoadingScreen from "../../../components/common/LoadingScreen";
import ErrorMessage from "../../../components/common/ErrorMessage";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import CourseAverageChart from "../components/CourseAverageChart";
import GradeDistributionChart from "../components/GradeDistributionChart";
import RecentEvaluations from "../components/RecentEvaluations";
import PerformanceSummary from "../components/PerformanceSummary";

import { getDashboardData } from "../services/dashboardService";

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

  const [dashboardData, setDashboardData] = useState({
    cursos: [],
    estudiantes: [],
    docentes: [],
    evaluaciones: [],
    notas: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
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

    loadDashboard();
  }, []);

  const analytics = useMemo(() => {
    const courseAverageData = getCourseAverageData(
      dashboardData.cursos,
      dashboardData.notas
    );

    const gradeDistributionData = getGradeDistributionData(
      dashboardData.notas
    );

    const promedioGeneral = getGeneralAverage(dashboardData.notas);

    const porcentajeAprobados = getApprovedPercentage(
      dashboardData.notas
    );

    const recentEvaluations = getRecentEvaluations(
      dashboardData.evaluaciones
    );

    return {
      courseAverageData,
      gradeDistributionData,
      promedioGeneral,
      porcentajeAprobados,
      recentEvaluations,
    };
  }, [dashboardData]);

  if (loading) {
    return <LoadingScreen message="Cargando dashboard académico..." />;
  }

  const isStudent = user?.rol === ROLES.ESTUDIANTE;

  return (
    <div className="space-y-6">
      <DashboardHeader />

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
            value={dashboardData.estudiantes.length}
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
            value={dashboardData.notas.length}
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
            value={dashboardData.evaluaciones.length}
            description="Evaluaciones disponibles"
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
          totalNotas={dashboardData.notas.length}
        />
      </section>
    </div>
  );
}