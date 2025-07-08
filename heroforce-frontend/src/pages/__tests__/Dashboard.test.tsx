const mockGetProjects = jest.fn();
const mockGetHeroes = jest.fn();
jest.mock("../../services/projectService", () => ({
  getProjects: (...args: any[]) => mockGetProjects(...args),
}));
jest.mock("../../services/userService", () => ({
  getHeroes: (...args: any[]) => mockGetHeroes(...args),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});
const mockAddToast = jest.fn();
jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));
jest.mock("../../components/ProjectCard", () => (props: any) => <div data-testid="project-card">{JSON.stringify(props.project)}</div>);

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../Dashboard";

function setUserLocalStorage(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza loading inicialmente", () => {
    setUserLocalStorage({});
    mockGetProjects.mockReturnValue(new Promise(() => {}));
    render(<Dashboard />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza projetos e filtros para usuário comum", async () => {
    setUserLocalStorage({ name: "João" });
    mockGetProjects.mockResolvedValueOnce([{ id: 1, name: "P1" }]);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/meus projetos heroicos/i)).toBeInTheDocument());
    expect(screen.getByText(/meus projetos heroicos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/responsável/i)).not.toBeInTheDocument();
    expect(screen.getAllByTestId("project-card")).toHaveLength(1);
  });

  it("renderiza botão de novo projeto e filtro de herói para admin", async () => {
    setUserLocalStorage({ name: "Admin", isAdmin: true });
    mockGetProjects.mockResolvedValueOnce([]);
    mockGetHeroes.mockResolvedValueOnce([{ id: 1, name: "Hero1" }]);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/criar novo projeto/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/responsável/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar novo projeto/i })).toBeInTheDocument();
  });

  it("filtra projetos ao mudar status", async () => {
    setUserLocalStorage({});
    mockGetProjects.mockResolvedValueOnce([{ id: 1 }]);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getAllByTestId("project-card")).toHaveLength(1));
    mockGetProjects.mockResolvedValueOnce([{ id: 2 }]);
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "concluido" } });
    await waitFor(() => expect(screen.getAllByTestId("project-card")).toHaveLength(1));
  });

  it("filtra projetos por herói para admin", async () => {
    setUserLocalStorage({ isAdmin: true });
    mockGetProjects.mockResolvedValueOnce([]);
    mockGetHeroes.mockResolvedValueOnce([{ id: 1, name: "Hero1" }]);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByLabelText(/responsável/i)).toBeInTheDocument());
    mockGetProjects.mockResolvedValueOnce([{ id: 3 }]);
    fireEvent.change(screen.getByLabelText(/responsável/i), { target: { value: "1" } });
    await waitFor(() => expect(screen.getAllByTestId("project-card")).toHaveLength(1));
  });

  it("navega para nova página ao clicar em Criar Novo Projeto", async () => {
    setUserLocalStorage({ isAdmin: true });
    mockGetProjects.mockResolvedValueOnce([]);
    mockGetHeroes.mockResolvedValueOnce([]);
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByRole("button", { name: /criar novo projeto/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /criar novo projeto/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/projects/new");
  });

  it("mostra toast de erro ao falhar getHeroes", async () => {
    setUserLocalStorage({ isAdmin: true });
    mockGetProjects.mockResolvedValueOnce([]);
    mockGetHeroes.mockRejectedValueOnce(new Error("fail"));
    render(<Dashboard />);
    await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith("Erro ao carregar heróis", "error"));
  });

  it("mostra toast de erro ao falhar getProjects", async () => {
    setUserLocalStorage({});
    mockGetProjects.mockRejectedValueOnce(new Error("fail"));
    render(<Dashboard />);
    await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith("Erro ao buscar projetos com filtros", "error"));
  });
}); 