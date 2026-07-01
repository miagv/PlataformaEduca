import axiosClient from "../../../api/axiosClient";

export async function tomarAsistencia(salonId, fecha, asistencias) {
  const response = await axiosClient.post("/asistencias", { salonId, fecha, asistencias });
  return response.data;
}

export async function getAsistencias(salonId, fecha) {
  const response = await axiosClient.get("/asistencias", { params: { salonId, fecha } });
  return response.data;
}

export async function getEstadisticas(salonId, desde, hasta) {
  const response = await axiosClient.get("/asistencias/estadisticas", { params: { salonId, desde, hasta } });
  return response.data;
}

export async function verificarAsistencia(salonId, fecha) {
  const response = await axiosClient.get("/asistencias/verificar", { params: { salonId, fecha } });
  return response.data;
}
