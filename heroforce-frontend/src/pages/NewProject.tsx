import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { useToast } from "../context/ToastContext";
import { getHeroes } from "../services/userService";

const NewProject = () => {
  const [heroes, setHeroes] = useState<{ id: string; name: string }[]>([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.isAdmin) {
      addToast("Acesso restrito a administradores.", "error");
      navigate("/dashboard");
    }
  }, [addToast, navigate]);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const data = await getHeroes();
        setHeroes(data);
      } catch (error) {
        addToast("Erro ao carregar heróis", "error");
      }
    };

    fetchHeroes();
  }, [addToast]);

  return (
    <ProjectForm
      project={null}
      heroes={heroes}
      onClose={() => navigate("/dashboard")}
      onSave={() => {
        addToast("Projeto criado com sucesso!", "success");
        navigate("/dashboard");
      }}
    />
  );
};

export default NewProject;
