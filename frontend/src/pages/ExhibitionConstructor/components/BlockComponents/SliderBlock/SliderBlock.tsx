import React, { useState } from 'react';
import styles from './SliderBlock.module.scss';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import { BlockItem, ExhibitionBlock } from '../../../types';

interface SliderBlockProps {
  blockId: string;
  items: BlockItem[];
  style?: React.CSSProperties;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  readOnly?: boolean;
}

const SliderBlock: React.FC<SliderBlockProps> = ({
                                                   blockId,
                                                   items = [],
                                                   style,
                                                   onImageUpload,
                                                   onImageRemove,
                                                   updateBlock,
                                                   readOnly = false,
                                                 }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
  };
  
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };
  
  const handleAddSlide = () => {
    if (!readOnly) {
      const newItems = [...items, { image_url: undefined, text: '' }];
      updateBlock(blockId, { items: newItems });
      setCurrentSlideIndex(newItems.length - 1);
    }
  };
  
  const handleRemoveSlide = (itemIndexToRemove: number) => {
    if (!readOnly) {
      const updatedItems = items.filter((_, idx) => idx !== itemIndexToRemove);
      updateBlock(blockId, { items: updatedItems });
      
      if (currentSlideIndex >= updatedItems.length && updatedItems.length > 0) {
        setCurrentSlideIndex(updatedItems.length - 1);
      } else if (updatedItems.length === 0) {
        setCurrentSlideIndex(0);
      }
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
              disabled={items.length <= 1}
            >
              &lt;
            </button>
            <div className={styles.slideContent}>
              <ImageBlock
                imageUrl={currentItem?.image_url}
                onUpload={readOnly ? undefined : (file: File) => onImageUpload(blockId, currentSlideIndex, file)}
                onRemove={readOnly ? undefined : () => handleRemoveSlide(currentSlideIndex)}
                readOnly={readOnly}
              />
            </div>
            <button
              className={`${styles.navButton} ${styles.next}`}
              onClick={handleNextSlide}
              disabled={items.length <= 1}
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
      {!readOnly && (
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
      )}
      {readOnly && items.length > 0 && (
        <div className={styles.controls}>
          <span className={styles.slideCounter}>
            {currentSlideIndex + 1} / {items.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default SliderBlock;
