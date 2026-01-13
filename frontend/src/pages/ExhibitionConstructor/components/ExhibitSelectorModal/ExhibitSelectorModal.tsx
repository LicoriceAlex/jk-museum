import React, { useState, useEffect, useMemo } from 'react';
import styles from './ExhibitSelectorModal.module.scss';
import { getToken } from '../../../../utils/serviceToken';

interface Exhibit {
  id: string;
  title: string;
  image_key?: string;
  author?: string;
  creation_date?: string;
  exhibit_type?: string;
  description?: string;
}

interface ExhibitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exhibits: Exhibit[]) => void;
}

const ExhibitSelectorModal: React.FC<ExhibitSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [selectedExhibits, setSelectedExhibits] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadExhibits();
    }
  }, [isOpen]);

  const loadExhibits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      const url = `${import.meta.env.VITE_API_URL}/api/v1/exhibits/`;
      
      const response = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить экспонаты');
      }

      const data = await response.json();
      setExhibits(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки экспонатов');
      console.error('Error loading exhibits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExhibits = useMemo(() => {
    if (!searchTerm.trim()) return exhibits;
    
    const searchLower = searchTerm.toLowerCase();
    return exhibits.filter(exhibit =>
      exhibit.title?.toLowerCase().includes(searchLower) ||
      exhibit.author?.toLowerCase().includes(searchLower) ||
      exhibit.description?.toLowerCase().includes(searchLower) ||
      exhibit.exhibit_type?.toLowerCase().includes(searchLower)
    );
  }, [exhibits, searchTerm]);

  const handleToggleExhibit = (exhibitId: string) => {
    setSelectedExhibits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exhibitId)) {
        newSet.delete(exhibitId);
      } else {
        newSet.add(exhibitId);
      }
      return newSet;
    });
  };

  const handleAddExhibits = () => {
    if (selectedExhibits.size === 0) return;
    const selected = exhibits.filter(ex => selectedExhibits.has(ex.id));
    onSelect(selected);
    setSelectedExhibits(new Set());
    setSearchTerm('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const decade = Math.floor(year / 10) * 10;
      return `${decade}-е`;
    } catch {
      // Если дата в формате YYYY, просто используем её
      if (dateString.match(/^\d{4}$/)) {
        const year = parseInt(dateString);
        const decade = Math.floor(year / 10) * 10;
        return `${decade}-е`;
      }
      return '';
    }
  };

  const getImageUrl = (imageKey?: string) => {
    if (!imageKey) return '';
    const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
    return `${apiUrl}/api/v1/files/${imageKey}`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.headerTitle}>Выбрать экспонаты</span>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
          <h2 className={styles.title}>Экспонаты</h2>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="9" r="7" />
              <path d="m17 17-4-4" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.content}>
          {error && (
            <div className={styles.error}>
              {error}
              <button onClick={loadExhibits} className={styles.retryButton}>
                Повторить
              </button>
            </div>
          )}

          {isLoading ? (
            <div className={styles.loading}>Загрузка экспонатов...</div>
          ) : filteredExhibits.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm ? `Ничего не найдено по запросу "${searchTerm}"` : 'Экспонаты не найдены'}
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredExhibits.map(exhibit => {
                const isSelected = selectedExhibits.has(exhibit.id);
                return (
                  <div
                    key={exhibit.id}
                    className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                    onClick={() => handleToggleExhibit(exhibit.id)}
                  >
                    <div className={styles.imageWrapper}>
                      {exhibit.image_key ? (
                        <img
                          src={getImageUrl(exhibit.image_key)}
                          alt={exhibit.title}
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <span>📷</span>
                        </div>
                      )}
                      <div className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleExhibit(exhibit.id)}
                          onClick={(e) => e.stopPropagation()}
                          className={styles.checkbox}
                        />
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{exhibit.title}</h3>
                      <p className={styles.cardDate}>{formatDate(exhibit.creation_date)}</p>
                      <button
                        className={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement view functionality
                        }}
                      >
                        ПРОСМОТР
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.addButton}
            onClick={handleAddExhibits}
            disabled={selectedExhibits.size === 0}
          >
            ДОБАВИТЬ {selectedExhibits.size} {selectedExhibits.size === 1 ? 'ЭКСПОНАТ' : selectedExhibits.size < 5 ? 'ЭКСПОНАТА' : 'ЭКСПОНАТОВ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExhibitSelectorModal;
