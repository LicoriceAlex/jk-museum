import React from 'react';
import { Link } from 'react-router-dom';
import styles from './OrganisationRegisterForm.module.scss';

export const OrganisationRegisterForm: React.FC = () => {
  return (
    <div className={styles['register-form']}>
      <h1 className={styles['register-form__title']}>Регистрация музейной организации</h1>
      
      <form className={styles['register-form__form']}>
        <div className={styles['form-group']}>
          <input
            type="email"
            className={styles['form-input']}
            placeholder="Введите email организации"
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
          <input
            type="password"
            className={styles['form-input']}
            placeholder="Повторите пароль"
          />
        </div>
        
        <div className={styles['form-group']}>
          <input
            type="text"
            className={styles['form-input']}
            placeholder="Введите полное название"
          />
        </div>
        
        <div className={styles['form-group']}>
          <input
            type="text"
            className={styles['form-input']}
            placeholder="Телефон или другие контакты"
          />
        </div>
        
        <button type="submit" className={styles['submit-button']}>
          Отправить заявку
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
