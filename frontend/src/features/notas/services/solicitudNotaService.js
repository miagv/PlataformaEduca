import axiosClient from "../../../api/axiosClient";

export async function getSolicitudes() {
  const response = await axiosClient.get("/solicitudes-notas");
  return response.data;
}

export async function getMisSolicitudes() {
  const response = await axiosClient.get("/solicitudes-notas/mis-solicitudes");
  return response.data;
}

export async function crearSolicitud(data) {
  const response = await axiosClient.post("/solicitudes-notas", data);
  return response.data;
}

export async function aprobarSolicitud(id) {
  const response = await axiosClient.put(`/solicitudes-notas/${id}/aprobar`);
  return response.data;
}

export async function rechazarSolicitud(id, motivoRechazo) {
  const response = await axiosClient.put(`/solicitudes-notas/${id}/rechazar`, { motivoRechazo });
  return response.data;
}