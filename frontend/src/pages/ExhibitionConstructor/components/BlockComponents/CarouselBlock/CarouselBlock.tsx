import React, { useState } from 'react';
import styles from './CarouselBlock.module.scss';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import { BlockItem, ExhibitionBlock } from '../../../types';

interface CarouselBlockProps {
  blockId: string;
  title?: string;
  items: BlockItem[];
  variant?: string; // Например, 'center-view'
  autoplay?: boolean;
  speed?: number; // Скорость для автовоспроизведения
  style?: React.CSSProperties; // Для стилей текста/подписей
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
}

const CarouselBlock: React.FC<CarouselBlockProps> = ({
                                                       blockId,
                                                       title,
                                                       items = [],
                                                       variant = 'center-view', // Установим по умолчанию 'center-view' для этого вида
                                                       autoplay,
                                                       speed = 3000,
                                                       style,
                                                       onImageUpload,
                                                       onImageRemove,
                                                       updateBlock,
                                                     }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Для обработки автоматического переключения слайдов (если autoplay включен)
  // React.useEffect(() => {
  //   if (autoplay && items.length > 1) {
  //     const timer = setInterval(() => {
  //       setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
  //     }, speed);
  //     return () => clearInterval(timer);
  //   }
  // }, [autoplay, items.length, speed]);
  
  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
  };
  
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };
  
  const handleAddSlide = () => {
    const newItems = [...items, { image_url: undefined, text: '' }];
    updateBlock(blockId, { items: newItems });
    setCurrentSlideIndex(newItems.length - 1);
  };
  
  const handleRemoveSlide = (itemIndexToRemove: number) => {
    const updatedItems = items.filter((_, idx) => idx !== itemIndexToRemove);
    updateBlock(blockId, { items: updatedItems });
    
    if (currentSlideIndex >= updatedItems.length && updatedItems.length > 0) {
      setCurrentSlideIndex(updatedItems.length - 1);
    } else if (updatedItems.length === 0) {
      setCurrentSlideIndex(0);
    }
  };
  
  // Вычисляем индексы для отображения: текущий, предыдущий и следующий
  const displayItems = [];
  if (items.length > 0) {
    const prevIndex = (currentSlideIndex - 1 + items.length) % items.length;
    const nextIndex = (currentSlideIndex + 1) % items.length;
    
    // Добавляем предыдущий, текущий и следующий слайды для рендера
    if (items.length > 1) { // Если больше одного слайда, показываем превью
      displayItems.push({ item: items[prevIndex], index: prevIndex, type: 'prev' });
    }
    displayItems.push({ item: items[currentSlideIndex], index: currentSlideIndex, type: 'current' });
    if (items.length > 1) { // Если больше одного слайда, показываем превью
      displayItems.push({ item: items[nextIndex], index: nextIndex, type: 'next' });
    }
  }
  
  const showNavigation = items.length > 1;
  
  return (
    <div className={`${styles.block} ${styles[variant]}`}>
      {title && <h3 className={styles.title} style={style}>{title}</h3>}
      <div className={styles.carouselWrapper}>
        {showNavigation && (
          <button
            className={`${styles.navButton} ${styles.prev}`}
            onClick={handlePrevSlide}
          >
            &lt;
          </button>
        )}
        <div className={styles.carouselContainer}>
          {items.length > 0 ? (
            <div className={styles.slides}>
              {displayItems.map(({ item, index, type }) => (
                <div key={index} className={`${styles.slide} ${styles[type]}`}>
                  <div className={styles.imageWrapper}>
                    <ImageBlock
                      imageUrl={item.image_url}
                      onUpload={(file: File) => onImageUpload(blockId, index, file)}
                      onRemove={() => handleRemoveSlide(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyCarousel}>
              <p>Добавьте изображения в карусель</p>
            </div>
          )}
        </div>
        {showNavigation && (
          <button
            className={`${styles.navButton} ${styles.next}`}
            onClick={handleNextSlide}
          >
            &gt;
          </button>
        )}
      </div>
      <button onClick={handleAddSlide} className={styles.addSlideButton}>
        + Добавить слайд
      </button>
    </div>
  );
};

export default CarouselBlock;
