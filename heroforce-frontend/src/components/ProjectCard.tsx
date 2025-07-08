import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/components/ProjectCard.module.css";
import ConfirmDialog from "./ConfirmDialog";
import { deleteProject } from "../services/projectService";
import { useToast } from "../context/ToastContext";

const ProjectCard = ({ project }: { project: any }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      addToast("Projeto deletado com sucesso!", "success");
      window.location.reload();
    } catch {
      addToast("Erro ao deletar o projeto", "error");
    }
  };

  const statusLabelMap: Record<string, string> = {
    pendente: "Pendente",
    emandamento: "Em Andamento",
    concluido: "Concluído",
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message={`Tem certeza que deseja deletar o projeto "${project.name}"?`}
          onConfirm={() => {
            setShowConfirm(false);
            handleDelete();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div
        className={`${styles.projectCard} ${statusClass}`}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <h3 className={styles.name}>{project.name}</h3>
        <pre className={styles.description}>{project.description}</pre>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>

        <h5 className={styles.responsavel}>
          Responsável:{" "}
          {project.hero?.name && project.hero?.heroName
            ? `${project.hero.name} (${project.hero.heroName})`
            : project.hero?.name || "Não atribuído"}
        </h5>

        <span>
          Status:
          <span
            className={`${styles.status} ${
              project.status === "emandamento"
                ? styles.emandamentoStatus
                : project.status === "concluido"
                ? styles.concluidoStatus
                : styles.pendenteStatus
            }`}
          >
            {project.status === "emandamento"
              ? "Em Andamento"
              : project.status === "concluido"
              ? "Concluído"
              : "Pendente"}
          </span>
        </span>

        {isAdmin && (
          <div className={styles.buttons}>
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${project.id}/edit`);
              }}
            >
              Editar
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
            >
              Deletar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectCard;
