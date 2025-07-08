const mockGetProjectById = jest.fn();
const mockNavigate = jest.fn();
const mockAddToast = jest.fn();

jest.mock("../../services/projectService", () => ({
  getProjectById: (...args: any[]) => mockGetProjectById(...args),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: jest.fn(),
  };
});

jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProjectDetails from "../ProjectDetails";
import * as router from "react-router-dom";

describe("ProjectDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (router.useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("renderiza loading inicialmente", () => {
    mockGetProjectById.mockReturnValue(new Promise(() => {}));
    render(<ProjectDetails />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza detalhes do projeto quando encontrado", async () => {
    mockGetProjectById.mockResolvedValueOnce({
      id: 1,
      name: "Projeto X",
      description: "Desc",
      hero: { name: "Hero1" },
      status: "concluido",
      progress: 80,
      metrics: {
        agility: 8,
        enchantment: 7,
        efficiency: 9,
        excellence: 10,
        transparency: 6,
        ambition: 5,
      },
    });
    render(<ProjectDetails />);
    await waitFor(() =>
      expect(screen.getByText("Projeto X")).toBeInTheDocument()
    );
    expect(screen.getByText("Projeto X")).toBeInTheDocument();
    expect(screen.getByText(/desc/i)).toBeInTheDocument();
    expect(screen.getByText(/responsável/i)).toBeInTheDocument();
    expect(screen.getByText(/concluído/i)).toBeInTheDocument();
    expect(screen.getByText(/progresso/i)).toBeInTheDocument();
    expect(screen.getByText(/agilidade/i)).toBeInTheDocument();
    expect(screen.getByText(/ambição/i)).toBeInTheDocument();
  });

  it("mostra mensagem de projeto não encontrado se não houver projeto", async () => {
    mockGetProjectById.mockResolvedValueOnce(null);
    render(<ProjectDetails />);
    await waitFor(() =>
      expect(screen.getByText(/projeto não encontrado/i)).toBeInTheDocument()
    );
  });

  it("mostra mensagem de redirecionando se id for 'new'", async () => {
    (router.useParams as jest.Mock).mockReturnValue({ id: "new" });


    mockGetProjectById.mockClear();
    render(<ProjectDetails />);
    await waitFor(() =>
      expect(screen.getByText(/redirecionando/i)).toBeInTheDocument()
    );
    expect(mockGetProjectById).not.toHaveBeenCalled();
  });

  it("mostra toast e redireciona se erro 404", async () => {
    mockGetProjectById.mockRejectedValueOnce({ response: { status: 404 } });
    render(<ProjectDetails />);
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "Projeto não encontrado",
        "error"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("mostra toast de erro genérico se erro diferente de 404", async () => {
    mockGetProjectById.mockRejectedValueOnce({});
    render(<ProjectDetails />);
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "Erro ao carregar projeto",
        "error"
      );
    });
  });

  it("navega para dashboard ao clicar em Voltar", async () => {
    mockGetProjectById.mockResolvedValueOnce({
      id: 1,
      name: "Projeto X",
      description: "Desc",
      hero: { name: "Hero1" },
      status: "concluido",
      progress: 80,
      metrics: {
        agility: 8,
        enchantment: 7,
        efficiency: 9,
        excellence: 10,
        transparency: 6,
        ambition: 5,
      },
    });
    render(<ProjectDetails />);
    await waitFor(() =>
      expect(screen.getByText("Projeto X")).toBeInTheDocument()
    );
    screen.getByRole("button", { name: /voltar/i }).click();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
