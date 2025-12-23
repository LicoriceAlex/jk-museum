import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import styles from './AccountSettings.module.scss';

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRegisterOrganization = () => {
    navigate('/auth/organisation-register');
    onClose();
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    // Remove token, clear user data, etc.
    localStorage.removeItem('token');
    navigate('/auth/login');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Настройки аккаунта</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.content}>
          <button
            className={styles.option}
            onClick={handleRegisterOrganization}
          >
            <span className={styles.optionText}>ЗАРЕГИСТРИРОВАТЬ МУЗЕЙНУЮ ОРГАНИЗАЦИЮ</span>
            <ChevronRight size={24} className={styles.arrow} />
          </button>
          
          <button
            className={`${styles.option} ${styles.logoutOption}`}
            onClick={handleLogout}
          >
            <span className={styles.optionText}>ВЫЙТИ ИЗ АККАУНТА</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

