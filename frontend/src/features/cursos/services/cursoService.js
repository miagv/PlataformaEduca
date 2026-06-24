import axiosClient from "../../../api/axiosClient";

export async function getCursos() {
  const response = await axiosClient.get("/cursos");
  return response.data;
}

export async function createCurso(curso) {
  const response = await axiosClient.post("/cursos", curso);
  return response.data;
}

export async function updateCurso(id, curso) {
  const response = await axiosClient.put(`/cursos/${id}`, curso);
  return response.data;
}

export async function deleteCurso(id) {
  const response = await axiosClient.delete(`/cursos/${id}`);
  return response.data;
}