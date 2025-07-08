import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import styles from "../styles/pages/ProjectDetails.module.css";
import { getProjectById } from "../services/projectService";
import Loading from "../components/Loading";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id || id === "new") {
          setLoading(false);
          return;
        }
        const data = await getProjectById(id);
        setProject(data);
      } catch (error: any) {
        if (error.response?.status === 404) {
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

    fetchProject();
  }, [id, navigate, addToast]);

  if (loading) return <Loading />;
  if (id === "new") return <div>Redirecionando...</div>;
  if (!project) return <div>Projeto não encontrado</div>;

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate("/dashboard")}
        className={styles.backButton}
      >
        Voltar
      </button>

      <h1>{project.name}</h1>
      <pre className={styles.description}>{project.description}</pre>

      <p className={styles.description}>
        Responsável: {`${project.hero.name} (${project.hero.heroName})`}
      </p>

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
              {project.metrics.agility}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Encantamento</span>
            <div className={styles.metricValue}>
              {project.metrics.enchantment}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Eficiência</span>
            <div className={styles.metricValue}>
              {project.metrics.efficiency}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Excelência</span>
            <div className={styles.metricValue}>
              {project.metrics.excellence}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Transparência</span>
            <div className={styles.metricValue}>
              {project.metrics.transparency}/10
            </div>
          </div>
          <div className={styles.metricItem}>
            <span>Ambição</span>
            <div className={styles.metricValue}>
              {project.metrics.ambition}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
