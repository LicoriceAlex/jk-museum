import React from 'react';
import styles from './ExhibitModal.module.scss';

interface Exhibit {
  id: string;
  title: string;
  image_key: string;
  author?: string;
  creation_date?: string;
  exhibit_type?: string;
  description?: string;
}

interface ExhibitModalProps {
  exhibit: Exhibit;
  onClose: () => void;
}

const ExhibitModal: React.FC<ExhibitModalProps> = ({ exhibit, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>...</button>
        
        <div className={styles.imageWrapper}>
          {/* Expand button in top-left corner */}
          <button className={styles.expandButton} onClick={() => {}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                 strokeLinejoin="round">
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          
          {/* Close button in top-right corner */}
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                 strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          
          <img src={exhibit.image_key} alt={exhibit.title}
               className={styles.imageTop}/>
        </div>
        
        <div className={styles.content}>
          {exhibit.title && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Название экспоната</h3>
              <p className={styles.sectionContent}>{exhibit.title}</p>
            </div>
          )}
          
          {exhibit.author && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Автор</h3>
              <p className={styles.sectionContent}>{exhibit.author}</p>
            </div>
          )}
          
          {exhibit.creation_date && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Дата создания</h3>
              <p className={styles.sectionContent}>{exhibit.creation_date}</p>
            </div>
          )}
          
          {exhibit.exhibit_type && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Тип экспоната</h3>
              <p className={styles.sectionContent}>{exhibit.exhibit_type}</p>
            </div>
          )}
          
          {exhibit.description && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Описание экспоната</h3>
              <p className={styles.sectionContent}>{exhibit.description}</p>
            </div>
          )}
          
          <div className={styles.editButtonWrapper}>
            <button className={styles.editButton}>Редактировать</button>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ExhibitModal;
