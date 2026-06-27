import axiosClient from "./axiosClient";

export async function getDocentes() {
  const response = await axiosClient.get("/docentes");
  return response.data;
}

export async function createDocente(docente) {
  const response = await axiosClient.post("/docentes", docente);
  return response.data;
}

export async function updateDocente(id, docente) {
  const response = await axiosClient.put(`/docentes/${id}`, docente);
  return response.data;
}

export async function deleteDocente(id) {
  const response = await axiosClient.delete(`/docentes/${id}`);
  return response.data;
}
