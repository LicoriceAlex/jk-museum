import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.scss";
import { register } from "../../features/auth/services/authService.ts";

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }
    
    const result = await register({
      email,
      password,
      name: "Имя",
      surname: "Фамилия",
      patronymic: "Отчество",
      role: "user",
    });
    
    if (result?.error) {
      setError("Ошибка при регистрации");
    } else {
      navigate("/auth/login");
    }
  };
  
  return (
    <div className={styles["register-form"]}>
      <h1 className={styles["register-form__title"]}>Регистрация</h1>
      
      <form className={styles["register-form__form"]} onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <input
            type="email"
            className={styles["form-input"]}
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className={styles["form-group"]}>
          <input
            type="password"
            className={styles["form-input"]}
            placeholder="Создайте пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className={styles["form-group"]}>
          <input
            type="password"
            className={styles["form-input"]}
            placeholder="Повторите пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        
        {error && <p className={styles["error-text"]}>{error}</p>}
        
        <button type="submit" className={styles["submit-button"]}>
          Зарегистрироваться
        </button>
      </form>
      
      <div className={styles["auth-link"]}>
        <Link to="/auth/login" className={styles["auth-link__text"]}>
          Вход в профиль →
        </Link>
      </div>
    </div>
  );
};
