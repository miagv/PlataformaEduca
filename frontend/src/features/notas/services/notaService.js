import axiosClient from "../../../api/axiosClient";

export async function getNotas() {
  const response = await axiosClient.get("/notas");
  return response.data;
}

export async function getNotasPorEstudiante(estudianteId) {
  const response = await axiosClient.get(`/notas/estudiante/${estudianteId}`);
  return response.data;
}

export async function createNota(nota) {
  const response = await axiosClient.post("/notas", nota);
  return response.data;
}