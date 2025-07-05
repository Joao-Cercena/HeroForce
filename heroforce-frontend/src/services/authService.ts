import axios from "axios";
import { useToast } from "../context/ToastContext";

const API_URL = "http://localhost:3001/auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
    throw new Error("Erro desconhecido ao fazer login");
  }
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  heroCharacter: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {

      throw new Error(error.response?.data?.message || "Erro ao registrar");
    }
    throw new Error("Erro desconhecido ao registrar");
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) return null;

    if (user) {
      return JSON.parse(user);
    }

    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};
