// LoginForm.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';

export const LoginForm: React.FC = () => {
  return (
    <div className={styles['login-form']}>
      <h1 className={styles['login-form__title']}>Вход в профиль</h1>
      
      <form className={styles['login-form__form']}>
        <div className={styles['form-group']}>
          <input
            type="email"
            className={styles['form-input']}
            placeholder="EMAIL"
          />
        </div>
        
        <div className={styles['form-group']}>
          <input
            type="password"
            className={styles['form-input']}
            placeholder="Пароль"
          />
        </div>
        
        <div className={styles['form-options']}>
          <label className={styles['checkbox-label']}>
            <input type="checkbox" className={styles['checkbox-input']} />
            <span className={styles['checkbox-text']}>ЗАБЫЛИ ПАРОЛЬ?</span>
          </label>
        </div>
        
        <button type="submit" className={styles['submit-button']}>
          Войти
        </button>
      </form>
      
      <div className={styles.links}>
        <div className={styles['auth-link']}>
          <Link to="/auth/register" className={styles['auth-link__text']}>
            Регистрация
          </Link>
          
          <Link to="/auth/organisation-register" className={styles['auth-link__text']}>
            Регистрация музейной организации
          </Link>
        </div>
      </div>
    </div>
  );
};
