console.log(require.resolve("react-router-dom"));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

jest.mock("../../services/authService", () => ({
  login: jest.fn(),
}));
const mockLogin = require("../../services/authService").login;

const mockAddToast = jest.fn();
jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza campos de email, senha e botões", () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrar-se/i })).toBeInTheDocument();
  });

  it("permite digitar email e senha", () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    expect(emailInput).toHaveValue("test@email.com");
    expect(passwordInput).toHaveValue("123456");
  });

  it("chama login e navega ao dashboard em sucesso", async () => {
    mockLogin.mockResolvedValue({
      access_token: "token123",
      user: { name: "João", heroImage: "img.png" },
    });
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("a@a.com", "senha", mockAddToast);
      expect(localStorage.getItem("token")).toBe("token123");
      expect(localStorage.getItem("user")).toContain("João");
      expect(localStorage.getItem("heroAvatar")).toBe("img.png");
      expect(mockAddToast).toHaveBeenCalledWith("Bem-vindo, João!", "success");
    });
  });

  it("mostra toast de erro ao falhar login", async () => {
    mockLogin.mockRejectedValue(new Error("fail"));
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Erro ao fazer login", "error");
    });
  });

  it("mostra loading ao submeter", async () => {
    let resolveLogin: any;
    mockLogin.mockImplementation(
      () => new Promise((resolve) => { resolveLogin = resolve; })
    );
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByRole("button", { name: /carregando/i })).toBeDisabled();
    resolveLogin({ access_token: "t", user: { name: "n", heroImage: "h" } });
    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
  });

  it("navega para registro ao clicar em Registrar-se", () => {
    renderWithRouter(<Login />);
    const registerBtn = screen.getByRole("button", { name: /registrar-se/i });
    fireEvent.click(registerBtn);
  });
}); 