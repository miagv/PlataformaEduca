import axiosClient from "../../../api/axiosClient";

export async function getEvaluaciones() {
  const response = await axiosClient.get("/evaluaciones");
  return response.data;
}

export async function createEvaluacion(evaluacion) {
  const response = await axiosClient.post("/evaluaciones", evaluacion);
  return response.data;
}

export async function updateEvaluacion(id, evaluacion) {
  const response = await axiosClient.put(`/evaluaciones/${id}`, evaluacion);
  return response.data;
}

export async function deleteEvaluacion(id) {
  const response = await axiosClient.delete(`/evaluaciones/${id}`);
  return response.data;
}