import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiDownload, FiRefreshCw } from "react-icons/fi";

import LoadingScreen from "../../../common/LoadingScreen";
import ErrorMessage from "../../../common/ErrorMessage";

import { getDashboardData } from "../../dashboard/services/dashboardService";
import {
  getCourseAverageData,
  getGeneralAverage,
} from "../../dashboard/charts/chartHelpers";

export default function ReportesPage() {
  const [data, setData] = useState({
    cursos: [],
    estudiantes: [],
    docentes: [],
    evaluaciones: [],
    notas: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardData();

      setData(response);
    } catch (err) {
      setError(
        err.response?.data ||
          "No se pudieron cargar los reportes académicos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const courseData = useMemo(
    () => getCourseAverageData(data.cursos, data.notas),
    [data]
  );

  const generalAverage = useMemo(
    () => getGeneralAverage(data.notas),
    [data.notas]
  );

  function exportCsv() {
    const headers = [
      "Curso",
      "Promedio",
      "Cantidad de notas",
    ];

    const rows = courseData.map((course) => [
      course.curso,
      course.promedio,
      course.cantidadNotas,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "reporte-rendimiento-cursos.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <LoadingScreen message="Generando reportes académicos..." />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FiBarChart2 size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#012169]">
                Reportes académicos
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Rendimiento general y promedio por curso.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadReports}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FiRefreshCw />
            Actualizar
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            <FiDownload />
            Exportar CSV
          </button>
        </div>
      </section>

      <ErrorMessage message={error} />

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Promedio general</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {generalAverage} / 20
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Cursos analizados</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.cursos.length}
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Notas procesadas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.notas.length}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900">
            Rendimiento por curso
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Promedio calculado según todas las notas asociadas a cada curso.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Curso
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Promedio
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cantidad de notas
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {courseData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No existen cursos registrados para generar el reporte.
                  </td>
                </tr>
              ) : (
                courseData.map((course) => {
                  const aprobado = course.promedio >= 11;

                  return (
                    <tr key={course.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {course.curso}
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {course.promedio} / 20
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {course.cantidadNotas}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            aprobado
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {aprobado ? "Aprobado" : "En riesgo"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}