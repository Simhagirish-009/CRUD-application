import axios from "axios";
const API_URL = "http://127.0.0.1:8000/api";

export const register = async (data) => {
  return await axios.post(`${API_URL}/register/`, data);
};

export const login = async (data) => {
  return await axios.post(`${API_URL}/login/`, data);
};

export const otp_verify = async (data) => {
  return await axios.post(`${API_URL}/verify-otp/`, data);
};