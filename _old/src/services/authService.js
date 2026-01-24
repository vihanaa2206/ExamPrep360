import axios from "axios";

const API = "http://127.0.0.1:5000"; // Flask backend

export const registerUser = (data) =>
  axios.post(`${API}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data);

export const forgotPassword = (data) =>
  axios.post(`${API}/auth/forgot-password`, data);

export const resetPassword = (token, data) =>
  axios.post(`${API}/auth/reset-password/${token}`, data);
