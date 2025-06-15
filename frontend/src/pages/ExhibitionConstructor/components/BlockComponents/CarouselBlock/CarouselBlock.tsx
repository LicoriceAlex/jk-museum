import React, { useState, useEffect, useRef } from 'react';
import styles from './CarouselBlock.module.scss';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import { BlockItem, ExhibitionBlock } from '../../../types';

interface CarouselBlockProps {
  blockId: string;
  title?: string;
  items: BlockItem[];
  variant?: string;
  autoplay?: boolean;
  speed?: number;
  style?: React.CSSProperties;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
}

const CarouselBlock: React.FC<CarouselBlockProps> = ({
                                                       blockId,
                                                       title,
                                                       items = [],
                                                       variant = 'center-view',
                                                       autoplay,
                                                       speed = 3000,
                                                       style,
                                                       onImageUpload,
                                                       onImageRemove,
                                                       updateBlock,
                                                     }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slidesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoplay && items.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, speed);
      return () => clearInterval(timer);
    }
  }, [autoplay, items.length, speed]);
  
  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
  };
  
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
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
  
  const displayItems = [];
  if (items.length > 0) {
    const prevIndex = (currentSlideIndex - 1 + items.length) % items.length;
    const nextIndex = (currentSlideIndex + 1) % items.length;
    
    if (items.length > 1) {
      displayItems.push({ item: items[prevIndex], index: prevIndex, type: 'prev' });
    }
    displayItems.push({ item: items[currentSlideIndex], index: currentSlideIndex, type: 'current' });
    if (items.length > 1) {
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
            <div
              className={styles.slides}
              ref={slidesRef}
            >
              {displayItems.map(({ item, index, type }) => (
                <div key={`${blockId}-${index}-${type}`} className={`${styles.slide} ${styles[type]}`}>
                  <div className={styles.imageWrapper}>
                    <ImageBlock
                      imageUrl={item.image_url}
                      onUpload={(file: File) => onImageUpload(blockId, index, file)}
                      onRemove={() => handleRemoveSlide(index)}
                    />
                  </div>
                  {/* {type === 'current' && item.text && (
                      <div className={styles.captionWrapper}>
                          <EditableText
                              value={item.text}
                              onChange={(newText) => updateBlock(blockId, {
                                  items: items.map((i, idx) => idx === index ? { ...i, text: newText } : i)
                              })}
                              placeholder="Введите подпись..."
                          />
                      </div>
                  )} */}
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
    </div>
  );
};

export default CarouselBlock;
