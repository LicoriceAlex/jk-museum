import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.scss";
import { useRegisterForm } from "../../layouts/AuthLayout/function.ts";

export const RegisterForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    error,
    handleSubmit,
  } = useRegisterForm();

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
