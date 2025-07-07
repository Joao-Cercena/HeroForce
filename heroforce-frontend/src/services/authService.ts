import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

type ToastFunction = (message: string, type: 'success' | 'error' | 'info') => void;

export const login = async (
  email: string,
  password: string,
   addToast: ToastFunction
) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      addToast(error.response?.data?.message || "Erro ao fazer login", "error");
    } else {
      addToast("Erro desconhecido ao fazer login", "error");
    }
  }
};

export const register = async (
  userData: {
    name: string;
    email: string;
    password: string;
    heroName: string;
    heroImage: string;
  },
  addToast: ToastFunction
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      addToast(error.response?.data?.message || "Erro ao registrar", "error");
    } else {
      addToast("Erro desconhecido ao registrar", "error");
    }
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
