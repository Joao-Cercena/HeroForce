jest.mock("axios", () => ({
  create: () => ({
    interceptors: { request: { use: jest.fn() } },
  }),
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  isAxiosError: (err: any) => !!err.isAxiosError,
}));

import axios from "axios";
import { login, register, getCurrentUser } from "../authService";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("authService", () => {
  const addToast = jest.fn();
  const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("faz POST para /login e retorna dados", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { token: "abc", user: { name: "João" } } });
      const result = await login("a@a.com", "senha", addToast);
      expect(mockedAxios.post).toHaveBeenCalledWith(`${API_URL}/login`, { email: "a@a.com", password: "senha" });
      expect(result).toEqual({ token: "abc", user: { name: "João" } });
    });

    it("chama addToast com mensagem de erro do axios", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { message: "Credenciais inválidas" } },
      });
      await login("a@a.com", "senha", addToast);
      expect(addToast).toHaveBeenCalledWith("Credenciais inválidas", "error");
    });

    it("chama addToast com erro desconhecido", async () => {
      mockedAxios.post.mockRejectedValueOnce({});
      await login("a@a.com", "senha", addToast);
      expect(addToast).toHaveBeenCalledWith("Erro desconhecido ao fazer login", "error");
    });
  });

  describe("register", () => {
    it("faz POST para /register e retorna dados", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });
      const userData = { name: "João", email: "a@a.com", password: "senha", heroName: "Hero", heroImage: "img.png" };
      const result = await register(userData, addToast);
      expect(mockedAxios.post).toHaveBeenCalledWith(`${API_URL}/register`, userData);
      expect(result).toEqual({ ok: true });
    });

    it("chama addToast com mensagem de erro do axios", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { message: "Email já cadastrado" } },
      });
      await register({} as any, addToast);
      expect(addToast).toHaveBeenCalledWith("Email já cadastrado", "error");
    });

    it("chama addToast com erro desconhecido", async () => {
      mockedAxios.post.mockRejectedValueOnce({});
      await register({} as any, addToast);
      expect(addToast).toHaveBeenCalledWith("Erro desconhecido ao registrar", "error");
    });
  });

  describe("getCurrentUser", () => {
    it("retorna null se não houver token", async () => {
      expect(await getCurrentUser()).toBeNull();
    });

    it("retorna usuário do localStorage se existir", async () => {
      localStorage.setItem("token", "abc");
      localStorage.setItem("user", JSON.stringify({ name: "João" }));
      expect(await getCurrentUser()).toEqual({ name: "João" });
    });

    it("busca usuário da API se não houver no localStorage", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.get.mockResolvedValueOnce({ data: { name: "Maria" } });
      const result = await getCurrentUser();
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/me`, { headers: { Authorization: "Bearer abc" } });
      expect(result).toEqual({ name: "Maria" });
      expect(localStorage.getItem("user")).toContain("Maria");
    });

    it("remove token e user do localStorage em erro", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
      const result = await getCurrentUser();
      expect(result).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });
}); 