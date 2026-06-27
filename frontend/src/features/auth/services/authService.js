import axiosClient from "../../../api/axiosClient";

export async function loginRequest(credentials) {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
}

export async function logoutRequest() {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
}

export async function registerRequest(data) {
  const response = await axiosClient.post("/auth/register", data);
  return response.data;
}

export async function forgotPasswordRequest(email) {
  const response = await axiosClient.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPasswordRequest(token, newPassword) {
  const response = await axiosClient.post("/auth/reset-password", { token, newPassword });
  return response.data;
}

export async function getCoordinadores() {
  const response = await axiosClient.get("/auth/coordinadores");
  return response.data;
}