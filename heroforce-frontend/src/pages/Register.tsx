import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useToast } from "../context/ToastContext";
import styles from "../styles/pages/Register.module.css";
import heroList from "../utils/heroes.json";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [heroCharacter, setHeroCharacter] = useState({
    name: heroList[0].name,
    profileImage: heroList[0].profileImage,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");

    if (password.length < 6) {
      setPasswordError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await register(
        {
          name,
          email,
          password,
          heroName: heroCharacter.name,
          heroImage: heroCharacter.profileImage,
        },
        addToast
      );
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
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError && e.target.value.length >= 6) {
                setPasswordError(""); // limpa o erro se o usuário corrigir
              }
            }}
            onBlur={() => {
              if (password.length < 6) {
                setPasswordError("A senha deve ter no mínimo 6 caracteres.");
              }
            }}
            required
          />

          {passwordError && (
            <small style={{ color: "red" }}>{passwordError}</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="hero">Herói</label>
          <select
            id="hero"
            value={heroCharacter.name}
            onChange={(e) => {
              const selected = heroList.find((h) => h.name === e.target.value);
              if (selected) {
                setHeroCharacter({
                  name: selected.name,
                  profileImage: selected.profileImage,
                });
              }
            }}
          >
            {heroList.map((hero) => (
              <option key={hero.id} value={hero.name}>
                {hero.name}
              </option>
            ))}
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
