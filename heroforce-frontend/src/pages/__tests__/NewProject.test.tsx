let lastOnSave: any = null;
let lastOnClose: any = null;
const mockGetHeroes = jest.fn();
const mockNavigate = jest.fn();
const mockAddToast = jest.fn();
jest.mock("../../services/userService", () => ({
  getHeroes: (...args: any[]) => mockGetHeroes(...args),
}));
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));
jest.mock("../../components/ProjectForm", () => (props: any) => {
  lastOnSave = props.onSave;
  lastOnClose = props.onClose;
  return <div data-testid="project-form" />;
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NewProject from "../NewProject";

describe("NewProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    lastOnSave = null;
    lastOnClose = null;
  });

  it("redireciona e mostra toast se não for admin", () => {
    localStorage.setItem("user", JSON.stringify({ isAdmin: false }));
    render(<NewProject />);
    expect(mockAddToast).toHaveBeenCalledWith("Acesso restrito a administradores.", "error");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("carrega heróis e renderiza ProjectForm para admin", async () => {
    localStorage.setItem("user", JSON.stringify({ isAdmin: true }));
    mockGetHeroes.mockResolvedValueOnce([{ id: 1, name: "Hero1" }]);
    render(<NewProject />);
    await waitFor(() => expect(screen.getByTestId("project-form")).toBeInTheDocument());
  });

  it("mostra toast de erro ao falhar carregar heróis", async () => {
    localStorage.setItem("user", JSON.stringify({ isAdmin: true }));
    mockGetHeroes.mockRejectedValueOnce(new Error("fail"));
    render(<NewProject />);
    await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith("Erro ao carregar heróis", "error"));
  });

  it("navega e mostra toast ao salvar ou fechar ProjectForm", async () => {
    localStorage.setItem("user", JSON.stringify({ isAdmin: true }));
    mockGetHeroes.mockResolvedValueOnce([]);
    render(<NewProject />);
    await waitFor(() => expect(screen.getByTestId("project-form")).toBeInTheDocument());
    lastOnSave();
    expect(mockAddToast).toHaveBeenCalledWith("Projeto criado com sucesso!", "success");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    lastOnClose();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
}); 