import React, { useState, useEffect } from 'react';
import ExhibitCard from '../ExhibitCard/ExhibitCard.tsx';
import ExhibitModal from '../ExhibitsModal/ExhibitModal.tsx';
import CreateExhibitModal from '../CreateExhibitModal/CreateExhibitModal.tsx';
import styles from './ExhibitsList.module.scss';

interface Exhibit {
  id: string;
  title: string;
  image_key: string;
  author?: string;
  creation_date?: string;
  exhibit_type?: string;
  description?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ExhibitsListProps {
  onSaveExhibit?: (newExhibit: any) => void;
}

const ExhibitsList: React.FC<ExhibitsListProps> = ({ onSaveExhibit }) => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  
  // Fetch exhibits on component mount
  useEffect(() => {
    fetchExhibits();
  }, []);
  
  const fetchExhibits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/exhibits/`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить экспонаты');
      }
      
      const data = await response.json();
      
      // The API returns data in the format { data: [...], count: number }
      setExhibits(data.data || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке экспонатов');
      console.error('Error fetching exhibits:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewClick = (id: string) => {
    const exhibit = exhibits.find(ex => ex.id === id);
    if (exhibit) {
      setSelectedExhibit(exhibit);
      setIsModalOpen(true);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExhibit(null);
  };
  
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  
  const handleSaveExhibit = (newExhibit: any) => {
    // Add the new exhibit to our local state
    setExhibits(prevExhibits => [...prevExhibits, newExhibit]);
    
    // Call the parent component's onSaveExhibit if provided
    if (onSaveExhibit) {
      onSaveExhibit(newExhibit);
    }
  };
  
  return (
    <div className={styles.container}>
      {/* Add create button */}
      <div className={styles.header}>
        <h2 className={styles.title}>Экспонаты</h2>
        <button
          className={styles.createButton}
          onClick={handleOpenCreateModal}
        >
          Добавить экспонат
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button
            className={styles.retryButton}
            onClick={fetchExhibits}
          >
            Повторить
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className={styles.loadingState}>
          Загрузка экспонатов...
        </div>
      ) : exhibits.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Экспонатов пока нет</p>
          <button
            className={styles.createButton}
            onClick={handleOpenCreateModal}
          >
            Добавить первый экспонат
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {exhibits.map(exhibit => (
            <div key={exhibit.id} className={styles.gridItem}>
              <ExhibitCard
                id={exhibit.id}
                title={exhibit.title}
                imageUrl={exhibit.image_key}
                onViewClick={handleViewClick}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* View exhibit modal */}
      {isModalOpen && selectedExhibit && (
        <ExhibitModal
          exhibit={selectedExhibit}
          onClose={handleCloseModal}
        />
      )}
      
      {/* Create exhibit modal */}
      {isCreateModalOpen && (
        <CreateExhibitModal
          onClose={handleCloseCreateModal}
          onSave={handleSaveExhibit}
        />
      )}
    </div>
  );
};

export default ExhibitsList;
