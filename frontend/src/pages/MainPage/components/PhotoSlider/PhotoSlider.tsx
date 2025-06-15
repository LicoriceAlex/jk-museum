import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './PhotoSlider.module.scss';

interface PhotoSliderProps {
  images: string[];
  autoplayInterval?: number;
  className?: string;
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({
                                                   images,
                                                   autoplayInterval = 7000,
                                                   className = ''
                                                 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const autoplayTimerRef = useRef<number | null>(null);
  
  const transitionDuration = 500;
  
  const goToSlide = useCallback((newIndex: number) => {
    if (isTransitioning || (newIndex === currentIndex && !isTransitioning)) {
      return;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
      setAnimationKey(prev => prev + 1);
    }, transitionDuration);
    
  }, [currentIndex, isTransitioning]);
  
  const nextSlide = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, images.length, goToSlide]);
  
  useEffect(() => {
    setIsInitialized(true);
    
    const animationTimeout = setTimeout(() => {
      setAnimationKey(1);
    }, 50);
    
    return () => clearTimeout(animationTimeout);
  }, [autoplayInterval]);
  
  useEffect(() => {
    if (!isInitialized || !isAutoPlaying) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
      return;
    }
    
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    
    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, autoplayInterval);
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextSlide, autoplayInterval, isAutoPlaying, isInitialized]);
  
  
  
  
  
  if (!images.length) {
    return <div className={styles.photoSlider}>No images provided</div>;
  }
  
  return (
    <div
      className={`${styles.photoSlider} ${className}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={`${styles.image} ${isTransitioning ? styles.fade : ''}`}
        />
        
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            Онлайн-платформа для создания и<br />
            публикации виртуальных выставок
          </div>
        </div>
      </div>
      
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={() => {
              if (index !== currentIndex) {
                goToSlide(index);
              }
            }}
          >
            <div
              key={`${index}-${animationKey}`}
              className={styles.progress}
              style={{
                animationDuration: index === currentIndex && isAutoPlaying && isInitialized
                  ? `${autoplayInterval}ms`
                  : '0ms'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoSlider;
