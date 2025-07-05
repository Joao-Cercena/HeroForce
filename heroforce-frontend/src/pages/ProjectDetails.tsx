import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import styles from "./ProjectDetails.module.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProject(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          addToast("Projeto não encontrado", "error");
          navigate("/dashboard");
        } else {
          addToast("Erro ao carregar projeto", "error");
          console.error("Erro ao buscar projeto:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== "new") {
      fetchProject();
    } else {
      setLoading(false); 
    }
  }, [id, navigate, addToast]);

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado</div>;
  if (id === "new") {
    return <div>Redirecionando...</div>; 
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate("/dashboard")}
        className={styles.backButton}
      >
        Voltar
      </button>

      <h1>{project.name}</h1>
      <p className={styles.description}>{project.description}</p>

      <div className={styles.description}>
      
        <p className={styles.description}>Responsável: {project.hero.name}</p>
      </div>
      <div className={styles.statusContainer}>
        <span>Status: </span>
        <span className={`${styles.status} ${styles[project.status]}`}>
          {project.status === "emandamento"
            ? "Em Andamento"
            : project.status === "concluido"
            ? "Concluído"
            : "Pendente"}
        </span>
      </div>

      <div className={styles.progressContainer}>
        <h3>Progresso: {project.progress}%</h3>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.metrics}>
        <h3>Métricas Heroicas</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span>Agilidade</span>
            <div className={styles.metricValue}>
              {project.metrics.agilidade}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Encantamento</span>
            <div className={styles.metricValue}>
              {project.metrics.encantamento}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Eficiência</span>
            <div className={styles.metricValue}>
              {project.metrics.eficiência}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Excelência</span>
            <div className={styles.metricValue}>
              {project.metrics.excelência}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Transparência</span>
            <div className={styles.metricValue}>
              {project.metrics.transparência}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Ambição</span>
            <div className={styles.metricValue}>
              {project.metrics.ambição}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
