import React, { useState } from 'react';
import styles from './Profile.module.scss';
import Header from '../../components/layout/Header/Header';
import { useProfile } from '../../features/profile/useProfile';
import {Repeat} from 'lucide-react';
import ExhibitionsGrid
  from '../MainPage/components/ExhibitionsGrid/ExhibitionsGrid.tsx';
import AccountSettings from './AccountSettings/AccountSettings';

const Profile: React.FC = () => {
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const {
    isEditing,
    profile,
    editedProfile,
    isLoading,
    isSaving,
    error,
    handleEdit,
    handleSave,
    handleBack,
    handleInputChange,
    handleAvatarChange
  } = useProfile();
  
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <h1 className={styles.title}>Личный кабинет</h1>
            <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка профиля...</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Личный кабинет</h1>
            {!isEditing && (
              <button
                onClick={() => setIsAccountSettingsOpen(true)}
                className={styles.settingsButton}
              >
                Настройки аккаунта
              </button>
            )}
          </div>
          
          {error && (
            <div style={{ padding: '10px', margin: '10px 0', backgroundColor: '#fee', color: '#c00', borderRadius: '4px' }}>
              Ошибка: {error}
            </div>
          )}
          
          <div className={styles.content}>
            <div className={styles.column}>
              <div className={styles.userNameSection}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={styles.nameInput}
                  />
                ) : (
                  <h2 className={styles.userName}>{profile.name}</h2>
                )}
              </div>
              <div className={styles.avatarSection}>
                {isEditing ? (
                  <div className={styles.avatarEdit}>
                    <img
                      src={editedProfile.avatar || '/api/placeholder/200/200'}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                    <div className={styles.avatarOverlay}>
                      <label htmlFor="avatar-upload" className={styles.avatarUpload}>
                        <span className={styles.uploadIcon}><Repeat size={28} /></span>
                        <span className={styles.uploadText}>Заменить фото</span>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className={styles.hiddenInput}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={profile.avatar || '/api/placeholder/200/200'}
                    alt="Avatar"
                    className={styles.avatar}
                  />
                )}
              </div>
            </div>
            
            <div className={styles.column}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>О себе</h3>
                {isEditing ? (
                  <div className={styles.inputGroup}>
                    <textarea
                      value={editedProfile.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      className={styles.aboutTextarea}
                      rows={4}
                      placeholder={'Расскажите о себе'}
                    />
                  </div>
                ) : (
                  <p className={styles.aboutText}>{profile.about}</p>
                )}
              </div>
            </div>
            
            <div className={styles.column}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Почта</h3>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={styles.emailInput}
                  />
                ) : (
                  <p className={styles.emailText}>{profile.email}</p>
                )}
              </div>
              {/* Здесь можно добавить секцию для "Контакты", если она будет */}
              {/* <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Контакты</h3>
                <p className={styles.contactText}>Ваши контакты будут здесь</p>
              </div> */}
            </div>
          </div>
          
          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button
                  onClick={handleBack}
                  className={styles.backButton}
                >
                  ← Назад
                </button>
                <div className={styles.actions__edit}>
                  <button
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={isSaving}
                  >
                    {isSaving ? "Сохранение..." : "Сохранить"}
                  </button>
                  
                  <button onClick={() => {}}
                    className={styles.changePasswordButton}>
                    Изменить пароль
                  </button>
                </div>
              
              </>
            ) : (
              <button
                onClick={handleEdit}
                className={styles.editButton}
              >
                Редактировать
              </button>
            )}
          </div>
        </div>
        <ExhibitionsGrid variant={'compact'} />
      </div>
      
      <AccountSettings
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
      />
    </div>
  );
};

export default Profile;
