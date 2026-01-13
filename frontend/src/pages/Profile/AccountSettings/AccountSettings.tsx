import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, Check } from 'lucide-react';
import styles from './AccountSettings.module.scss';
import { getMyOrganizations, saveSelectedOrganization, getSelectedOrganizationId, removeSelectedOrganization, type OrganizationResponse } from '../../../features/organizations/service';

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOrganizations();
      const savedOrgId = getSelectedOrganizationId();
      setSelectedOrgId(savedOrgId);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSelectOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(`.${styles.selectWrapper}`)) {
          setIsSelectOpen(false);
        }
      }
    };

    if (isSelectOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectOpen]);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orgs = await getMyOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить организации');
      console.error('Error loading organizations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOrganization = (organizationId: string) => {
    setSelectedOrgId(organizationId);
    saveSelectedOrganization(organizationId);
    setIsSelectOpen(false);
    // Перезагружаем страницу для применения новой организации
    window.location.reload();
  };

  const handleRegisterOrganization = () => {
    navigate('/auth/organisation-register');
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    removeSelectedOrganization();
    navigate('/auth/login');
    onClose();
  };

  if (!isOpen) return null;

  const selectedOrganization = organizations.find(org => org.organization.id === selectedOrgId);

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
          <div className={styles.organizationSection}>
            <label className={styles.label}>Перейти в музейную организацию</label>
            <div className={styles.selectWrapper}>
              <div
                className={styles.selectInput}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span className={styles.selectText}>
                  {selectedOrganization ? selectedOrganization.organization.name : 'Выберите организацию'}
                </span>
                {selectedOrganization && (
                  <Check size={20} className={styles.checkIcon} />
                )}
              </div>
              {isSelectOpen && (
                <div className={styles.dropdown}>
                  {isLoading ? (
                    <div className={styles.dropdownItem}>Загрузка...</div>
                  ) : error ? (
                    <div className={styles.dropdownItem}>{error}</div>
                  ) : organizations.length === 0 ? (
                    <div className={styles.dropdownItem}>Нет доступных организаций</div>
                  ) : (
                    organizations.map((org) => (
                      <div
                        key={org.organization.id}
                        className={`${styles.dropdownItem} ${selectedOrgId === org.organization.id ? styles.selected : ''}`}
                        onClick={() => handleSelectOrganization(org.organization.id)}
                      >
                        {org.organization.name}
                        {selectedOrgId === org.organization.id && (
                          <Check size={16} className={styles.checkIcon} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

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

