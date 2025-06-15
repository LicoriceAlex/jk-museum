import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ExhibitCard from '../ExhibitCard/ExhibitCard';
import ExhibitModal from '../ExhibitsModal/ExhibitModal';
import CreateExhibitModal from '../CreateExhibitModal/CreateExhibitModal';
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
const ExhibitsList:React.FC = forwardRef<
  { fetchExhibits: () => Promise<void> },
  ExhibitsListProps
>(({ onSaveExhibit }, ref) => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  useImperativeHandle(ref, () => ({
    fetchExhibits
  }));
  
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
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  
  const handleSaveExhibit = async (newExhibit: any) => {
    try {
      setExhibits(prevExhibits => [...prevExhibits, newExhibit]);
      
      onSaveExhibit?.(newExhibit);
      await fetchExhibits();
    } catch (err) {
      console.error('Error updating exhibits list:', err);
    }
  };
  
  const handleUpdateExhibit = async (updatedExhibit: Exhibit) => {
    try {
      setExhibits(prevExhibits =>
        prevExhibits.map(exhibit =>
          exhibit.id === updatedExhibit.id ? updatedExhibit : exhibit
        )
      );
      onSaveExhibit?.(updatedExhibit);
      await fetchExhibits();
    } catch (err) {
      console.error('Error after updating exhibit:', err);
    }
  };
  
  return (
    <div className={styles.exhibitsList}>
      {error && (
        <div className={styles.error}>
          {error}
          <button
            className={styles.retryButton}
            onClick={fetchExhibits}
          >
            Повторить
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className={styles.loading}>
          Загрузка экспонатов...
        </div>
      ) : exhibits.length === 0 ? (
        <div className={styles.empty}>
          <p>Здесь пока ничего нет</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {exhibits.map(exhibit => (
            <div key={exhibit.id} className={styles.item}>
              <ExhibitCard
                id={exhibit.id}
                title={exhibit.title}
                imageUrl={`${import.meta.env.VITE_API_URL}/api/v1/files/${exhibit.image_key}`}
                onViewClick={handleViewClick}
              />
            </div>
          ))}
        </div>
      )}
      
      {isModalOpen && selectedExhibit && (
        <ExhibitModal
          exhibit={selectedExhibit}
          onClose={handleCloseModal}
          onUpdate={handleUpdateExhibit}
        />
      )}
      
      {isCreateModalOpen && (
        <CreateExhibitModal
          onClose={handleCloseCreateModal}
          onSave={handleSaveExhibit}
        />
      )}
    </div>
  );
});

export default ExhibitsList;
