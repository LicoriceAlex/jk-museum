// Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

interface HeaderProps {
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/logo.svg" alt="JK.Exhibitions" className={styles.logoIcon} />
            <span className={styles.logoText}>JK.Exhibitions</span>
          </Link>
        </div>
        
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link
                to="/exhibits"
                className={`${styles.navLink} ${currentPath === '/exhibits' ? styles.active : ''}`}
              >
                Экспонаты
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="/exhibitions"
                className={`${styles.navLink} ${currentPath === '/exhibitions' ? styles.active : ''}`}
              >
                Выставки
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="/constructor"
                className={`${styles.navLink} ${currentPath === '/constructor' ? styles.active : ''}`}
              >
                Конструктор
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="/account"
                className={`${styles.navLink} ${currentPath === '/account' ? styles.active : ''}`}
              >
                Личный кабинет
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
