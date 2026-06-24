export async function getEstudiantes() {
  const response = await axiosClient.get("/estudiantes");
  return response.data;
}