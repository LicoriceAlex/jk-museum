import React from "react";
import { Outlet} from 'react-router-dom';
import styles from './AuthLayout.module.scss';
import authBg from '/authBg.png';
import museumIcon from '/Vector.svg';


const AuthLayout: React.FC = () => {
  return (
    <div className={styles.authLayout} style={{ backgroundImage: `url(${authBg})` }}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <img src={museumIcon} className={styles.museumSvg} alt={'Museum icon'}/>
          <p>JK.Exhibitions</p>
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
