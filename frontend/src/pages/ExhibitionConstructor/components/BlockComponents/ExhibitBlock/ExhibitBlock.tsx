import React, { useState, useEffect } from 'react';
import styles from './ExhibitBlock.module.scss';
import ExhibitModal from '../../../../ExhibitsPage/components/ExhibitsModal/ExhibitModal';
import { getToken } from '../../../../../utils/serviceToken';

interface Exhibit {
  id: string;
  title: string;
  image_key: string;
  author?: string;
  creation_date?: string;
  exhibit_type?: string;
  description?: string;
}

interface ExhibitBlockProps {
  exhibitId: string;
  imageUrl?: string;
  readOnly?: boolean;
}

const ExhibitBlock: React.FC<ExhibitBlockProps> = ({ exhibitId, imageUrl, readOnly = false }) => {
  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (exhibitId) {
      loadExhibit();
    }
  }, [exhibitId]);

  const loadExhibit = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      const url = `${apiUrl}/api/v1/exhibits/${exhibitId}`;
      
      const response = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить экспонат');
      }

      const data = await response.json();
      setExhibit(data);
    } catch (error) {
      console.error('Error loading exhibit:', error);
      // В режиме просмотра не показываем ошибку, просто не загружаем экспонат
      if (!readOnly) {
        setExhibit(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = () => {
    if (exhibit) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getImageUrl = () => {
    if (imageUrl) return imageUrl;
    if (exhibit?.image_key) {
      const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      return `${apiUrl}/api/v1/files/${exhibit.image_key}`;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!exhibit) {
    return (
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.error}>Экспонат не найден</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img
            src={getImageUrl()}
            alt={exhibit.title}
            className={styles.image}
          />
          <div className={styles.imageOverlay}>
            <h3 className={styles.titleOverlay}>{exhibit.title}</h3>
            <button className={styles.viewButtonOverlay} onClick={handleViewClick}>
              Просмотр
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && exhibit && (
        <ExhibitModal
          exhibit={exhibit}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ExhibitBlock;
