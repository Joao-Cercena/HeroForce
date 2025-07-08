let lastOnSave: any = null;
let lastOnClose: any = null;
const mockGetProjectById = jest.fn();
const mockGetHeroes = jest.fn();
jest.mock("../../services/projectService", () => ({
  getProjectById: (...args: any[]) => mockGetProjectById(...args),
}));
jest.mock("../../services/userService", () => ({
  getHeroes: (...args: any[]) => mockGetHeroes(...args),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "123" }),
  };
});
const mockAddToast = jest.fn();
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
import EditProject from "../EditProject";

describe("EditProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    lastOnSave = null;
    lastOnClose = null;
  });

  it("renderiza loading enquanto busca dados", () => {
    mockGetProjectById.mockReturnValue(new Promise(() => {}));
    mockGetHeroes.mockReturnValue(new Promise(() => {}));
    render(<EditProject />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza ProjectForm com dados do projeto e heróis", async () => {
    mockGetProjectById.mockResolvedValueOnce({ id: 1, name: "P1" });
    mockGetHeroes.mockResolvedValueOnce([{ id: 2, name: "Hero" }]);
    render(<EditProject />);
    await waitFor(() => expect(screen.getByTestId("project-form")).toBeInTheDocument());
  });

  it("mostra toast e navega para dashboard em erro", async () => {
    mockGetProjectById.mockRejectedValueOnce(new Error("fail"));
    mockGetHeroes.mockResolvedValueOnce([]);
    render(<EditProject />);
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Erro ao carregar projeto ou heróis", "error");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("navega e mostra toast ao salvar ou fechar ProjectForm", async () => {
    mockGetProjectById.mockResolvedValueOnce({ id: 1 });
    mockGetHeroes.mockResolvedValueOnce([]);
    render(<EditProject />);
    await waitFor(() => expect(screen.getByTestId("project-form")).toBeInTheDocument());

    lastOnSave();
    expect(mockAddToast).toHaveBeenCalledWith("Projeto atualizado com sucesso!", "success");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

    lastOnClose();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
}); 