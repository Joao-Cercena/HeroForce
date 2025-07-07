import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectCard.module.css";
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

  const statusClass = statusClassMap[status as keyof typeof statusClassMap] || "";

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

      <div className={`${styles.projectCard} ${statusClass}`} onClick={() => navigate(`/projects/${project.id}`)}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${project.progress || 0}%` }}></div>
        </div>

        <h5>Responsável: {project.hero?.name}</h5>
        <span>Status: {statusLabelMap[status] || "Desconhecido"}</span>

        {isAdmin && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default ProjectCard;
