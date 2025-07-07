import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProjectForm.module.css";

type Hero = {
  id: string;
  name: string;
};

type ProjectFormProps = {
  project: {
    id?: string;
    name?: string;
    description?: string;
    status?: "pendente" | "emandamento" | "concluido";
    progress?: number;
    hero?: { id: string; };
    metrics?: {
      agility: number;
      enchantment: number;
      efficiency: number;
      excellence: number;
      transparency: number;
      ambition: number;
    };
  } | null;
  heroes: Hero[];
  onClose: () => void;
  onSave: (project: any) => void;
};

const metricLabels: Record<string, string> = {
  agilidade: "Agilidade",
  encantamento: "Encantamento",
  eficiência: "Eficiência",
  excelência: "Excelência",
  transparência: "Transparência",
  ambição: "Ambição",
};

const ProjectForm = ({
  project,
  heroes,
  onClose,
  onSave,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "pendente",
    progress: project?.progress || 0,
    hero: project?.hero ? project.hero.id : "",
    metrics: {
      agilidade: project?.metrics?.agility ?? 5,
      encantamento: project?.metrics?.enchantment ?? 5,
      eficiência: project?.metrics?.efficiency ?? 5,
      excelência: project?.metrics?.excellence ?? 5,
      transparência: project?.metrics?.transparency ?? 5,
      ambição: project?.metrics?.ambition ?? 5,
    },
  });

  useEffect(() => {
    if (!formData.hero && heroes.length > 0) {
      setFormData((prev) => ({
        ...prev,
        hero: heroes[0].id,
      }));
    }
  }, [heroes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = project?.id
        ? `http://localhost:3001/projects/${project.id}`
        : "http://localhost:3001/projects";

      const method = project?.id ? "put" : "post";

      const metricsMap = {
        agilidade: "agility",
        encantamento: "enchantment",
        eficiência: "efficiency",
        excelência: "excellence",
        transparência: "transparency",
        ambição: "ambition",
      };

      const convertedMetrics: Record<string, number> = {};
      for (const [ptKey, value] of Object.entries(formData.metrics)) {
        const enKey = metricsMap[ptKey as keyof typeof metricsMap];
        if (enKey) {
          convertedMetrics[enKey] = value;
        }
      }

      const payload = {
        ...formData,
        metrics: convertedMetrics,
      };

      const response = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onSave(response.data);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleMetricChange = (metric: string, value: number) => {
    setFormData({
      ...formData,
      metrics: {
        ...formData.metrics,
        [metric]: Math.max(0, Math.min(10, value)),
      },
    });
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>{project?.id ? "Editar Projeto" : "Novo Projeto"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome do Projeto</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Herói Responsável</label>
            <select
              value={formData.hero}
              onChange={(e) =>
                setFormData({ ...formData, hero: e.target.value })
              }
            >
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "pendente"
                    | "emandamento"
                    | "concluido",
                })
              }
            >
              <option value="pendente">Pendente</option>
              <option value="emandamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Progresso (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  progress: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className={styles.metricsSection}>
            <h3>Métricas Heroicas</h3>
            {Object.entries(formData.metrics).map(([metric, value]) => (
              <div key={metric} className={styles.metricControl}>
                <label>{metricLabels[metric]}</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={value}
                  onChange={(e) =>
                    handleMetricChange(metric, parseInt(e.target.value))
                  }
                />
                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
