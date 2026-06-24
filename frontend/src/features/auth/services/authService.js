import axiosClient from "../../../api/axiosClient";

export async function loginRequest(credentials) {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
}

export async function logoutRequest() {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
}