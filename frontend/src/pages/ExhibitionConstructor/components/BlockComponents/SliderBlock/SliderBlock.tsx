import React, { useState } from 'react';
import styles from './SliderBlock.module.scss';
import ImageBlock from '../ImageBlock/ImageBlock.tsx'; // Для отображения и управления изображениями
import { BlockItem, ExhibitionBlock } from '../../../types';

interface SliderBlockProps {
  blockId: string;
  items: BlockItem[];
  style?: React.CSSProperties; // Для стилей текста/подписей
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  // Добавьте сюда другие пропсы для слайдера, например:
  // autoplay?: boolean;
  // speed?: number;
}

const SliderBlock: React.FC<SliderBlockProps> = ({
                                                   blockId,
                                                   items = [],
                                                   style,
                                                   onImageUpload,
                                                   onImageRemove,
                                                   updateBlock,
                                                 }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
  };
  
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };
  
  const handleAddSlide = () => {
    const newItems = [...items, { image_url: undefined, text: '' }];
    updateBlock(blockId, { items: newItems });
    setCurrentSlideIndex(newItems.length - 1); // Переключиться на новый слайд
  };
  
  const handleRemoveSlide = (itemIndexToRemove: number) => {
    const updatedItems = items.filter((_, idx) => idx !== itemIndexToRemove);
    updateBlock(blockId, { items: updatedItems });
    
    // Adjust currentSlideIndex if the removed slide was before it or was the last one
    if (currentSlideIndex >= updatedItems.length && updatedItems.length > 0) {
      setCurrentSlideIndex(updatedItems.length - 1);
    } else if (updatedItems.length === 0) {
      setCurrentSlideIndex(0); // Reset if no slides left
    }
  };
  
  const currentItem = items[currentSlideIndex];
  
  return (
    <div className={styles.sliderBlock}>
      <div className={styles.sliderContainer}>
        {items.length > 0 ? (
          <>
            <button
              className={`${styles.navButton} ${styles.prev}`}
              onClick={handlePrevSlide}
              disabled={items.length <= 1} // Отключить кнопки, если слайд один или нет слайдов
            >
              &lt;
            </button>
            <div className={styles.slideContent}>
              <ImageBlock
                imageUrl={currentItem?.image_url}
                onUpload={(file: File) => onImageUpload(blockId, currentSlideIndex, file)}
                onRemove={() => handleRemoveSlide(currentSlideIndex)}
              />
            </div>
            <button
              className={`${styles.navButton} ${styles.next}`}
              onClick={handleNextSlide}
              disabled={items.length <= 1} // Отключить кнопки, если слайд один или нет слайдов
            >
              &gt;
            </button>
          </>
        ) : (
          <div className={styles.emptySlider}>
            <p>Добавьте изображения в слайдер</p>
          </div>
        )}
      </div>
      <div className={styles.controls}>
        <button onClick={handleAddSlide} className={styles.addButton}>
          + Добавить слайд
        </button>
        {items.length > 0 && (
          <span className={styles.slideCounter}>
            {currentSlideIndex + 1} / {items.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default SliderBlock;
