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

export async function getMisNotas() {
  const response = await axiosClient.get("/notas/mis-notas");
  return response.data;
}

export async function updateNota(id, nota) {
  const response = await axiosClient.put(`/notas/${id}`, nota);
  return response.data;
}

export async function deleteNota(id) {
  const response = await axiosClient.delete(`/notas/${id}`);
  return response.data;
}