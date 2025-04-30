import React from 'react';
import styles from './ExhibitCard.module.scss';

interface ExhibitCardProps {
  id: string;
  title: string;
  imageUrl: string;
  onViewClick: (id: string) => void;
}

const ExhibitCard: React.FC<ExhibitCardProps> = ({ id, title, imageUrl, onViewClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} />
        <div className={styles.imageOverlay}>
          <h3 className={styles.titleOverlay}>{title}</h3>
          <button className={styles.viewButtonOverlay} onClick={() => onViewClick(id)}>
            Просмотр
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExhibitCard;
