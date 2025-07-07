import React, { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { getHeroes } from "../services/userService";
import ProjectCard from "../components/ProjectCard";
import styles from "./Dashboard.module.css";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [heroFilter, setHeroFilter] = useState("");
  const [heroes, setHeroes] = useState<any[]>([]);

  const navigate = useNavigate();
  const { addToast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchHeroes = async () => {
      if (!isAdmin) return;

      try {
        const heroesData = await getHeroes();
        setHeroes(heroesData);
      } catch (error) {
        addToast("Erro ao carregar heróis", "error");
      }
    };

    fetchHeroes();
  }, [isAdmin]);

  useEffect(() => {
    const fetchFilteredProjects = async () => {
      setLoading(true);
      try {
        const filters: any = {};
        if (statusFilter) filters.status = statusFilter;
        if (heroFilter && isAdmin) filters.heroId = heroFilter;

        const data = await getProjects(filters);
        setProjects(data);
      } catch (error) {
        addToast("Erro ao buscar projetos com filtros", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProjects();
  }, [statusFilter, heroFilter, isAdmin]);

  if (loading) return <Loading />;

  return (
    <div className={styles.dashboard}>
      {isAdmin && (
        <button
          className={styles.newButton}
          onClick={() => navigate("/projects/new")}
        >
          Criar Novo Projeto
        </button>
      )}

      <h1>Meus Projetos Heroicos</h1>

      <div className={styles.filters}>
        <div>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="emandamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        {isAdmin && (
          <div>
            <label>Responsável:</label>
            <select
              value={heroFilter}
              onChange={(e) => setHeroFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
