import React from 'react';
import { Link} from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

interface HeaderProps {
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  const { isAuthenticated, isLoading} = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  if (isLoading) {
    return (
      <header className={`${styles.header} ${isHomePage ? styles.homeHeader : ''}`}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/logo.svg" alt="JK.Exhibitions"
                   className={styles.logoIcon}/>
              <span className={styles.logoText}>JK.Exhibitions</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <header
        className={`${styles.header} ${isHomePage ? styles.homeHeader : ''}`}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/logo.svg" alt="JK.Exhibitions"
                   className={styles.logoIcon}/>
              <span className={styles.logoText}>JK.Exhibitions</span>
            </Link>
          </div>
          
          <div className={styles.authButtons}>
            <Link to="/auth/login" className={styles.navLink}>
              Вход
            </Link>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <header
      className={`${styles.header} ${isHomePage ? styles.homeHeader : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/logo.svg" alt="JK.Exhibitions"
                 className={styles.logoIcon}/>
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
                to="/profile"
                className={`${styles.navLink} ${currentPath === '/profile' ? styles.active : ''}`}
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
