import React, { useState } from 'react';
import ExhibitionCard, { Exhibition } from '../ExhibitionCard/ExhibitionCard.tsx';
import styles from './ExhibitionsGrid.module.scss';

const mockExhibitions: Exhibition[] = [
  {
    id: '1',
    title: 'Авангардная живопись XX-го века',
    author: 'Василий Кандинский',
    creation_date: '2024-01-15',
    description: 'Выставка работ великого русского художника-авангардиста',
    exhibit_type: 'живопись',
    image_key: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    organization_id: 'org-1',
    created_at: '2024-05-20T10:00:00Z',
    updated_at: '2024-06-01T15:30:00Z'
  },
  {
    id: '2',
    title: 'Современная скульптура',
    author: 'Анна Петрова',
    creation_date: '2024-02-20',
    description: 'Коллекция современных скульптурных работ',
    exhibit_type: 'скульптура',
    image_key: 'https://images.unsplash.com/photo-1594736797933-d0e6c4a32d87?w=400&h=300&fit=crop',
    organization_id: 'org-1',
    created_at: '2024-06-01T12:00:00Z',
    updated_at: '2024-05-30T14:20:00Z'
  },
  {
    id: '3',
    title: 'Импрессионизм в России',
    author: 'Илья Репин',
    creation_date: '2024-03-10',
    description: 'Русский импрессионизм конца XIX века',
    exhibit_type: 'живопись',
    image_key: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
    organization_id: 'org-1',
    created_at: '2024-06-10T09:30:00Z',
    updated_at: '2024-05-25T16:45:00Z'
  },
  {
    id: '4',
    title: 'Фотография XX века',
    author: 'Александр Родченко',
    creation_date: '2024-04-05',
    description: 'Эволюция фотографического искусства',
    exhibit_type: 'фотография',
    image_key: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=400&h=300&fit=crop',
    organization_id: 'org-1',
    created_at: '2024-06-15T11:15:00Z',
    updated_at: '2024-05-20T13:10:00Z'
  },
  {
    id: '5',
    title: 'Декоративно-прикладное искусство',
    author: 'Мария Иванова',
    creation_date: '2024-05-12',
    description: 'Традиционные ремесла и современность',
    exhibit_type: 'декоративное искусство',
    image_key: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    organization_id: 'org-1',
    created_at: '2024-06-20T14:00:00Z',
    updated_at: '2024-05-15T10:30:00Z'
  },
  {
    id: '6',
    title: 'Абстрактное искусство',
    author: 'Пит Мондриан',
    creation_date: '2024-06-01',
    description: 'Геометрическая абстракция в живописи',
    exhibit_type: 'живопись',
    image_key: 'https://images.unsplash.com/photo-1594736797933-d0e6c4a32d87?w=400&h=300&fit:crop',
    organization_id: 'org-1',
    created_at: '2024-06-25T16:20:00Z',
    updated_at: '2024-06-02T12:00:00Z'
  },
  {
    id: '7',
    title: 'Народные промыслы',
    author: 'Анонимные мастера',
    creation_date: '2024-06-05',
    description: 'Выставка традиционных народных промыслов',
    exhibit_type: 'декоративное искусство',
    image_key: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
    organization_id: 'org-1',
    created_at: '2024-07-01T10:00:00Z',
    updated_at: '2024-06-06T11:00:00Z'
  }
];

interface ExhibitionsGridProps {
  variant?: 'full' | 'compact';
  exhibitions?: Exhibition[];
  title?: string;
}

const ExhibitionsGrid: React.FC<ExhibitionsGridProps> = ({
                                                           variant = 'full',
                                                           exhibitions,
                                                           title = 'Выставки'
                                                         }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все музеи');
  const categories = ['Искусство', 'История', 'Наука', 'Культура', 'Природа', 'Все музеи'];
  const sortOptions = ['Сначала новые', 'Сначала старые', 'По названию'];

  // Объединяем выставки с сервера с предустановленными
  const dataToUse = exhibitions && exhibitions.length > 0 
    ? [...exhibitions, ...mockExhibitions] 
    : mockExhibitions;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(6);
  };
  
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };
  const filteredExhibitions = dataToUse.filter(exhibition => {
    const matchesSearch = exhibition.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (variant === 'full') {
      matchesCategory = activeCategory === 'Все музеи' ||
        exhibition.exhibit_type.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === 'Искусство' && ['живопись', 'скульптура', 'фотография', 'декоративное искусство'].includes(exhibition.exhibit_type.toLowerCase()));
    }
    
    return matchesSearch && matchesCategory;
  });
  
  const visibleExhibitions = filteredExhibitions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredExhibitions.length;
  
  return (
    <div className={styles.pageContainer}>
      {variant === 'full' ? (
        <>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Поиск"
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className={styles.searchIcon}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
          
          <div className={styles.filterBar}>
            <div className={styles.categories}>
              {categories.map(category => (
                <span
                  key={category}
                  className={`${styles.categoryItem} ${activeCategory === category ? styles.active : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </span>
              ))}
            </div>
            <div className={styles.sortOptions}>
              <span>Показывать:</span>
              <select className={styles.sortSelect}>
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.sortArrow}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.compactHeader}>
          <h2 className={styles.compactTitle}>{title}</h2>
          <div className={styles.searchBarCompact}>
            <input
              type="text"
              placeholder="Поиск"
              className={styles.searchInputCompact}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className={styles.searchIconCompact}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.grid}>
        {visibleExhibitions.map((exhibition) => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>
      
      {hasMore && (
        <div className={styles.showMoreContainer}>
          <button className={styles.showMoreButton} onClick={handleShowMore}>
            Показать больше
          </button>
        </div>
      )}
    </div>
  );
};

export default ExhibitionsGrid;
