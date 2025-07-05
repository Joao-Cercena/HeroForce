import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProjectForm from "../components/ProjectForm";
import { useToast } from "../context/ToastContext";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [project, setProject] = useState(null);
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, heroesRes] = await Promise.all([
          axios.get(`http://localhost:3001/projects/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`http://localhost:3001/users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setProject(projectRes.data);
        setHeroes(heroesRes.data);
      } catch (error) {
        addToast("Erro ao carregar projeto ou heróis", "error");
        navigate("/dashboard");
      }
    };

    fetchData();
  }, [id, navigate, addToast]);

  if (!project) return <p>Carregando...</p>;

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
