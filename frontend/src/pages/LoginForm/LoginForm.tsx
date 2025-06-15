import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.scss";
import { login } from "../../features/auth/services/authService.ts"; // путь к authService

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login({ username: email, password });
    
    if (result?.error) {
      setError("Неверный логин или пароль");
    } else {
      navigate("/profile");
    }
  };
  
  return (
    <div className={styles["login-form"]}>
      <h1 className={styles["login-form__title"]}>Вход в профиль</h1>
      
      <form className={styles["login-form__form"]} onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["form-input"]}
            placeholder="EMAIL"
          />
        </div>
        
        <div className={styles["form-group"]}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["form-input"]}
            placeholder="Пароль"
          />
        </div>
        
        <div className={styles["form-options"]}>
          <label className={styles["checkbox-label"]}>
            <input type="checkbox" className={styles["checkbox-input"]} />
            <span className={styles["checkbox-text"]}>ЗАБЫЛИ ПАРОЛЬ?</span>
          </label>
        </div>
        
        {error && <p className={styles["error-text"]}>{error}</p>}
        
        <button type="submit" className={styles["submit-button"]}>
          Войти
        </button>
      </form>
      
      <div className={styles.links}>
        <div className={styles["auth-link"]}>
          <Link to="/auth/register" className={styles["auth-link__text"]}>
            Регистрация
          </Link>
          
          <Link
            to="/auth/organisation-register"
            className={styles["auth-link__text"]}
          >
            Регистрация музейной организации
          </Link>
        </div>
      </div>
    </div>
  );
};
