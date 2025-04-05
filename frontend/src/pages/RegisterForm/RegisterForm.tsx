import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterForm.module.scss';

export const RegisterForm: React.FC = () => {
  return (
    <div className={styles['register-form']}>
      <h1 className={styles['register-form__title']}>Регистрация</h1>
      
      <form className={styles['register-form__form']}>
        <div className={styles['form-group']}>
          <input
            type="email"
            className={styles['form-input']}
            placeholder="Введите ваш email"
          />
        </div>
        
        <div className={styles['form-group']}>
          <input
            type="password"
            className={styles['form-input']}
            placeholder="Создайте пароль"
          />
        </div>
        
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>ПОВТОРИТЕ ПАРОЛЬ</label>
          <input
            type="password"
            className={styles['form-input']}
            placeholder="Повторите пароль"
          />
        </div>
        
        <button type="submit" className={styles['submit-button']}>
          Зарегистрироваться
        </button>
      </form>
      
      <div className={styles['auth-link']}>
        <Link to="/auth/login" className={styles['auth-link__text']}>
          Вход в профиль →
        </Link>
      </div>
    </div>
  );
};
