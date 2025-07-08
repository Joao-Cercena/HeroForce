const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../Register";

jest.mock("../../services/authService", () => ({
  register: jest.fn(),
}));
const mockRegister = require("../../services/authService").register;

const mockAddToast = jest.fn();
jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("../../utils/heroes.json", () => ([
  { id: 1, name: "Hero1", profileImage: "img1.png" },
  { id: 2, name: "Hero2", profileImage: "img2.png" },
]));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Register Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza campos de nome, email, senha, herói e botões", () => {
    renderWithRouter(<Register />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/herói/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar para login/i })).toBeInTheDocument();
  });

  it("permite digitar nome, email, senha e selecionar herói", () => {
    renderWithRouter(<Register />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.change(screen.getByLabelText(/herói/i), { target: { value: "Hero2" } });
    expect(screen.getByLabelText(/nome/i)).toHaveValue("João");
    expect(screen.getByLabelText(/email/i)).toHaveValue("a@a.com");
    expect(screen.getByLabelText(/senha/i)).toHaveValue("senha");
    expect(screen.getByLabelText(/herói/i)).toHaveValue("Hero2");
  });

  it("chama register e navega ao login em sucesso", async () => {
    mockRegister.mockResolvedValue({});
    renderWithRouter(<Register />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.change(screen.getByLabelText(/herói/i), { target: { value: "Hero2" } });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        {
          name: "João",
          email: "a@a.com",
          password: "senha",
          heroName: "Hero2",
          heroImage: "img2.png",
        },
        mockAddToast
      );
      expect(mockAddToast).toHaveBeenCalledWith(
        "Registro realizado com sucesso! Faça login.",
        "success"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("mostra toast de erro ao falhar registro", async () => {
    mockRegister.mockRejectedValue(new Error("Falha"));
    renderWithRouter(<Register />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Falha", "error");
    });
  });

  it("mostra loading ao submeter", async () => {
    let resolveRegister: any;
    mockRegister.mockImplementation(
      () => new Promise((resolve) => { resolveRegister = resolve; })
    );
    renderWithRouter(<Register />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "senha" } });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
    expect(screen.getByRole("button", { name: /cadastrando/i })).toBeDisabled();
    resolveRegister({});
    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
  });

  it("navega para login ao clicar em Voltar para Login", () => {
    renderWithRouter(<Register />);
    fireEvent.click(screen.getByRole("button", { name: /voltar para login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
}); 