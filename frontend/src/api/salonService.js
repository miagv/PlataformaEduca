import axiosClient from "./axiosClient";

export async function getSalones() {
  const response = await axiosClient.get("/salones");
  return response.data;
}

export async function getSalon(id) {
  const response = await axiosClient.get(`/salones/${id}`);
  return response.data;
}

export async function createSalon(salon) {
  const response = await axiosClient.post("/salones", salon);
  return response.data;
}

export async function updateSalon(id, salon) {
  const response = await axiosClient.put(`/salones/${id}`, salon);
  return response.data;
}

export async function deleteSalon(id) {
  const response = await axiosClient.delete(`/salones/${id}`);
  return response.data;
}

export async function getDocentesPorSalon(salonId) {
  const response = await axiosClient.get(`/salones/${salonId}/docentes`);
  return response.data;
}

export async function getReporteSalon(salonId) {
  const response = await axiosClient.get(`/salones/${salonId}/reporte`);
  return response.data;
}

export async function createCargaHoraria(salonId, data) {
  const response = await axiosClient.post(`/salones/${salonId}/carga-horaria`, data);
  return response.data;
}

export async function updateCargaHoraria(chId, data) {
  const response = await axiosClient.put(`/salones/carga-horaria/${chId}`, data);
  return response.data;
}

export async function deleteCargaHoraria(chId) {
  const response = await axiosClient.delete(`/salones/carga-horaria/${chId}`);
  return response.data;
}

export async function getMisSalones() {
  const response = await axiosClient.get("/salones/mis-salones");
  return response.data;
}

export async function getCursosPorSalon(salonId) {
  const response = await axiosClient.get(`/salones/${salonId}/cursos`);
  return response.data;
}

export async function getEstudiantesSinSalon() {
  const response = await axiosClient.get("/estudiantes/sin-salon");
  return response.data;
}

export async function asignarSalonAEstudiante(estudianteId, salonId) {
  const response = await axiosClient.put(`/estudiantes/${estudianteId}/asignar-salon`, { salonId });
  return response.data;
}
