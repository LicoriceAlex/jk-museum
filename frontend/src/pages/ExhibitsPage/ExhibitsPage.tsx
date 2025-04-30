import React, { useState } from 'react';
import Header from '../../components/layout/Header/Header.tsx';
import ExhibitsList from './components/ExhibitsList/ExhibitsList.tsx';
import CreateExhibitModal from './components/CreateExhibitModal/CreateExhibitModal.tsx';
import styles from './ExhibitsPage.module.scss';

interface Exhibit {
  id: string;
  title: string;
  image_key: string;
  author?: string;
  creation_date?: string;
  exhibit_type?: string;
  description?: string;
}

const ExhibitsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  
  const handleSaveExhibit = (newExhibit: any) => {
    // In a real application, you might want to do something with the new exhibit here
    // For example, make an API call to save it to the backend
    console.log('New exhibit saved:', newExhibit);
  };
  
  return (
    <div className={styles.page}>
      <Header currentPath="/exhibits" />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Экспонаты</h1>
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="20" height="20"
                   viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Поиск"
                className={styles.searchInput}
              />
            </div>
          </div>
          <ExhibitsList
            onSaveExhibit={handleSaveExhibit}
          />
          
          <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={handleOpenCreateModal}>
              <span className={styles.addIcon}>+</span>
              <span className={styles.addText}>Новый экспонат</span>
            </button>
          </div>
          
          {isCreateModalOpen && (
            <CreateExhibitModal
              onClose={handleCloseCreateModal}
              onSave={handleSaveExhibit}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ExhibitsPage;
