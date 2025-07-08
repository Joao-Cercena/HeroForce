import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
jest.mock("../../services/projectService", () => ({
  saveProject: jest.fn((payload) =>
    Promise.resolve({
      ...payload,
      metrics: {
        agility: payload.metrics.agilidade,
        enchantment: payload.metrics.encantamento,
        efficiency: payload.metrics.eficiência,
        excellence: payload.metrics.excelência,
        transparency: payload.metrics.transparência,
        ambition: payload.metrics.ambição,
      },
    })
  ),
}));
import { saveProject } from "../../services/projectService";
import ProjectForm from "../ProjectForm";

describe("ProjectForm", () => {
  const heroes = [
    { id: "1", name: "Hero1" },
    { id: "2", name: "Hero2" },
  ];
  const baseProject = {
    id: "123",
    name: "Projeto Teste",
    description: "Desc",
    status: "pendente" as const,
    progress: 10,
    hero: { id: "1" },
    metrics: {
      agility: 7,
      enchantment: 8,
      efficiency: 6,
      excellence: 9,
      transparency: 5,
      ambition: 4,
    },
  };

  it("renderiza campos do formulário para novo projeto", () => {
    render(
      <ProjectForm
        project={null}
        heroes={heroes}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByLabelText(/nome do projeto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/herói responsável/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/progresso/i)).toBeInTheDocument();
    expect(screen.getByText(/métricas heroicas/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /salvar projeto/i })
    ).toBeInTheDocument();
  });

  it("preenche campos e submete o formulário chamando onSave", async () => {
    const onSave = jest.fn();

    (saveProject as jest.Mock).mockResolvedValueOnce({
      name: "Novo",
      description: "Desc nova",
      status: "concluido",
      progress: 55,
      hero: "2",
      metrics: {
        agility: 9,
        enchantment: 5,
        efficiency: 5,
        excellence: 5,
        transparency: 5,
        ambition: 5,
      },
    });

    render(
      <ProjectForm
        project={null}
        heroes={heroes}
        onClose={jest.fn()}
        onSave={onSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/nome do projeto/i), {
      target: { value: "Novo" },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: "Desc nova" },
    });
    fireEvent.change(screen.getByLabelText(/herói responsável/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "concluido" },
    });
    fireEvent.change(screen.getByLabelText(/progresso/i), {
      target: { value: "55" },
    });
    fireEvent.change(screen.getByLabelText(/agilidade/i), {
      target: { value: "9" },
    });

    fireEvent.click(screen.getByRole("button", { name: /salvar projeto/i }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Novo",
          description: "Desc nova",
          status: "concluido",
          progress: 55,
          hero: "2",
          metrics: expect.objectContaining({ agility: 9 }),
        })
      )
    );

    expect(saveProject).toHaveBeenCalled();
  });

  it("chama onClose ao clicar em Cancelar", () => {
    const onClose = jest.fn();
    render(
      <ProjectForm
        project={null}
        heroes={heroes}
        onClose={onClose}
        onSave={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renderiza valores iniciais ao editar projeto", () => {
    render(
      <ProjectForm
        project={baseProject}
        heroes={heroes}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );
    expect(screen.getByLabelText(/nome do projeto/i)).toHaveValue(
      "Projeto Teste"
    );
    expect(screen.getByLabelText(/descrição/i)).toHaveValue("Desc");
    expect(screen.getByLabelText(/herói responsável/i)).toHaveValue("1");
    expect(screen.getByLabelText(/status/i)).toHaveValue("pendente");
    expect(screen.getByLabelText(/progresso/i)).toHaveValue(10);
    expect(screen.getByLabelText(/agilidade/i)).toHaveValue("7");
    expect(screen.getByLabelText(/encantamento/i)).toHaveValue("8");
    expect(screen.getByLabelText(/eficiência/i)).toHaveValue("6");
    expect(screen.getByLabelText(/excelência/i)).toHaveValue("9");
    expect(screen.getByLabelText(/transparência/i)).toHaveValue("5");
    expect(screen.getByLabelText(/ambição/i)).toHaveValue("4");
  });
});
