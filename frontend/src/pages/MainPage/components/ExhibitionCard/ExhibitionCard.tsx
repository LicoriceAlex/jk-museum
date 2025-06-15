import React from 'react';
import styles from './ExhibitionCard.module.scss';

export interface Exhibition {
  title: string;
  author: string;
  creation_date: string;
  description: string;
  exhibit_type: string;
  image_key: string;
  id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition }) => {
  const formatMonthDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  };
  
  const formatYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric'
    });
  };
  
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={exhibition.image_key || '/placeholder-museum.jpg'}
          alt={exhibition.title}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.date}>
          {formatMonthDay(exhibition.creation_date).toUpperCase()} - {formatMonthDay(exhibition.created_at).toUpperCase()} {formatYear(exhibition.created_at)}
        </div>
        <h3 className={styles.title}>{exhibition.title}</h3>
        <div className={styles.lineAndViewButton}>
          <div className={styles.line}></div>
          <button className={styles.viewButton}>
            Просмотр
          </button>
        </div>
      
      </div>
    </div>
  );
};

export default ExhibitionCard;
