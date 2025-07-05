import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectCard.module.css";

const ProjectCard = ({ project }: { project: any }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin;

  const status = project.status?.toLowerCase() || "";
  const statusClassMap = {
    pendente: styles.pendente,
    emandamento: styles.emandamento,
    concluido: styles.concluido,
  };

  const statusClass =
    statusClassMap[status as keyof typeof statusClassMap] || "";

  return (
    <div
      className={`${styles.projectCard} ${statusClass}`}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${project.progress || 0}%` }}
        ></div>
      </div>

      <h5>Responsável: {project.hero?.name}</h5>
      <span>Status: {project.status}</span>
      {isAdmin && (
        <button
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project.id}/edit`);
          }}
        >
          Editar
        </button>
      )}
    </div>
  );
};

export default ProjectCard;
