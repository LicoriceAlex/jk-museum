import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  const handleViewClick = () => {
    navigate(`/exhibitions/${exhibition.id}`);
  };

  // Обработка image_key: если это уже URL, используем его, иначе формируем URL через API
  const getImageUrl = () => {
    if (!exhibition.image_key) return '/placeholder-museum.jpg';
    if (exhibition.image_key.startsWith('http://') || exhibition.image_key.startsWith('https://')) {
      return exhibition.image_key;
    }
    const apiUrl = import.meta.env.VITE_API_URL || '';
    return `${apiUrl.replace(/\/+$/, '')}/api/v1/files/${exhibition.image_key}`;
  };
  
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={getImageUrl()}
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
          <button className={styles.viewButton} onClick={handleViewClick}>
            Просмотр
          </button>
        </div>
      
      </div>
    </div>
  );
};

export default ExhibitionCard;
