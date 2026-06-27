import axiosClient from "../../../api/axiosClient";

export async function getDashboardData() {
  const [cursosRes, estudiantesRes, docentesRes, evaluacionesRes, notasRes] =
    await Promise.all([
      axiosClient.get("/cursos"),
      axiosClient.get("/estudiantes"),
      axiosClient.get("/docentes"),
      axiosClient.get("/evaluaciones"),
      axiosClient.get("/notas"),
    ]);

  return {
    cursos: cursosRes.data || [],
    estudiantes: estudiantesRes.data || [],
    docentes: docentesRes.data || [],
    evaluaciones: evaluacionesRes.data || [],
    notas: notasRes.data || [],
  };
}