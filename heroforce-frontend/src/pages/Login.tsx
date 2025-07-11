import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useToast } from "../context/ToastContext";
import styles from "../styles/pages/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { access_token, user } = await login(email, password, addToast);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "heroAvatar",
        user.heroImage
      );

      addToast(`Bem-vindo, ${user.name}!`, "success");
      navigate("/dashboard");
    } catch (error) {
      addToast(
        "Erro ao fazer login",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>HeroForce - Login</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            ref={emailRef}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </div>

        <div className={styles.registerContainer}>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className={styles.registerButton}
          >
            Registrar-se
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
