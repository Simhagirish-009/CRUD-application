import axios from "axios";
const API_URL = "https://crud-application-rxyd.onrender.com/api";

export const register = async (data) => {
  return await axios.post(`${API_URL}/register/`, data);
};

export const login = async (data) => {
  return await axios.post(`${API_URL}/login/`, data);
};

export const otp_verify = async (data) => {
  return await axios.post(`${API_URL}/verify-otp/`, data);
};