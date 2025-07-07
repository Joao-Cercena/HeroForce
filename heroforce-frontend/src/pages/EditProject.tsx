import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { useToast } from "../context/ToastContext";
import { getProjectById } from "../services/projectService";
import { getHeroes } from "../services/userService";
import Loading from "../components/Loading";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [project, setProject] = useState(null);
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, heroesData] = await Promise.all([
          getProjectById(id!),
          getHeroes(),
        ]);
        setProject(projectData);
        setHeroes(heroesData);
      } catch (error) {
        addToast("Erro ao carregar projeto ou heróis", "error");
        navigate("/dashboard");
      }
    };

    fetchData();
  }, [id, navigate, addToast]);

  if (!project) return <Loading />;

  return (
    <ProjectForm
      project={project}
      heroes={heroes}
      onClose={() => navigate("/dashboard")}
      onSave={() => {
        addToast("Projeto atualizado com sucesso!", "success");
        navigate("/dashboard");
      }}
    />
  );
};

export default EditProject;
