import axiosClient from "../../../api/axiosClient";

export async function getEstudiantes() {
  const response = await axiosClient.get("/estudiantes");
  return response.data;
}

export async function getEstudiantesSinSalon() {
  const response = await axiosClient.get("/estudiantes/sin-salon");
  return response.data;
}

export async function getEstudiantesPorSalon(salonId) {
  const response = await axiosClient.get(`/estudiantes/salon/${salonId}`);
  return response.data;
}

export async function getEstudiante(id) {
  const response = await axiosClient.get(`/estudiantes/${id}`);
  return response.data;
}

export async function getMisEstudiantes() {
  const response = await axiosClient.get("/estudiantes/mis-estudiantes");
  return response.data;
}