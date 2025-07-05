import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useToast } from "../context/ToastContext";
import styles from "./Register.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroCharacter, setHeroCharacter] = useState("Spider-Man");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({ name, email, password, heroCharacter });
      addToast("Registro realizado com sucesso! Faça login.", "success");
      navigate("/login");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Erro no registro",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h1>Cadastre-se como Herói</h1>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.formGroup}>
          <label>Nome</label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Herói</label>
          <select
            value={heroCharacter}
            onChange={(e) => setHeroCharacter(e.target.value)}
          >
            <option value="Spider-Man">Homem-Aranha</option>
            <option value="Batman">Batman</option>
            <option value="Wonder Woman">Mulher-Maravilha</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate("/login")}
      >
        Voltar para Login
      </button>
    </div>
  );
};

export default Register;
