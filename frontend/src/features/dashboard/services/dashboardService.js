import api from "../../../services/api";

export async function getDashboardData() {
  const [cursosRes, estudiantesRes, docentesRes, evaluacionesRes, notasRes] =
    await Promise.all([
      api.get("/cursos"),
      api.get("/estudiantes"),
      api.get("/docentes"),
      api.get("/evaluaciones"),
      api.get("/notas"),
    ]);

  return {
    cursos: cursosRes.data || [],
    estudiantes: estudiantesRes.data || [],
    docentes: docentesRes.data || [],
    evaluaciones: evaluacionesRes.data || [],
    notas: notasRes.data || [],
  };
}