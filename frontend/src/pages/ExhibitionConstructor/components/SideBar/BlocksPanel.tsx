// components/BlocksPanel/BlocksPanel.tsx
import React, { useState, useRef } from 'react';
import { BlockType, BlockItem } from '../../types';
import styles from './BlocksPanel.module.scss';

interface BlocksPanelProps {
  addBlock: (type: BlockType, initialData?: { items?: BlockItem[]; content?: string; }) => void;
  onFileUpload: (file: File) => Promise<{ url: string }>;
}

const BlocksPanel: React.FC<BlocksPanelProps> = ({ addBlock, onFileUpload }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [numPhotos, setNumPhotos] = useState<number>(1);
  const [tempImageUrls, setTempImageUrls] = useState<string[]>([]);
  const [tempCarouselType, setTempCarouselType] = useState<'CAROUSEL' | 'SLIDER'>('CAROUSEL');
  const fileInputRefs = useRef<HTMLInputElement[]>([]);
  
  const [tempSingleImageTextUrl, setTempSingleImageTextUrl] = useState<string | undefined>(undefined);
  const [tempSingleImageTextContent, setTempSingleImageTextContent] = useState<string>('');
  const singleImageTextFileInputRef = useRef<HTMLInputElement>(null);
  
  
  const toggleCategory = (category: string) => {
    console.log('toggleCategory called with:', category); // DEBUG
    setExpandedCategory(prev => (prev === category ? null : category));
    setSelectedOption(null);
    resetCurrentOptionConfig();
  };
  
  const selectOption = (option: string) => {
    console.log('selectOption called with:', option); // DEBUG
    setSelectedOption(option);
    resetCurrentOptionConfig();
    if (option === 'IMAGES_OPTIONS' || option === 'CAROUSEL_OPTIONS') {
      setNumPhotos(1);
      setTempImageUrls(new Array(1).fill(undefined));
    } else if (option === 'PHOTO_SINGLE') {
      setTempImageUrls(new Array(1).fill(undefined));
    }
  };
  
  const closeConfigMenu = () => {
    console.log('closeConfigMenu called'); // DEBUG
    setSelectedOption(null);
    resetCurrentOptionConfig();
  };
  
  const resetCurrentOptionConfig = () => {
    console.log('resetCurrentOptionConfig called'); // DEBUG
    setNumPhotos(1);
    setTempImageUrls([]);
    setTempCarouselType('CAROUSEL');
    setTempSingleImageTextUrl(undefined);
    setTempSingleImageTextContent('');
    // Важно очищать ссылки на инпуты, если они не будут переиспользованы корректно
    // fileInputRefs.current = []; // Это может привести к проблемам с повторным использованием, оставьте как есть, если нет проблем
  };
  
  const handleNumPhotosChange = (change: number) => {
    console.log('handleNumPhotosChange called with:', change); // DEBUG
    const newNum = Math.max(1, Math.min(4, numPhotos + change));
    setNumPhotos(newNum);
    setTempImageUrls(prevUrls => {
      const newUrls = [...prevUrls];
      if (newNum < prevUrls.length) {
        return newUrls.slice(0, newNum);
      } else if (newNum > prevUrls.length) {
        while (newUrls.length < newNum) {
          newUrls.push(undefined);
        }
      }
      return newUrls;
    });
  };
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
    console.log('handleFileSelect called for index:', index); // DEBUG
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const { url } = await onFileUpload(file);
        setTempImageUrls(prevUrls => {
          const newUrls = [...prevUrls];
          newUrls[index] = url;
          return newUrls;
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      // Очистка значения input[type="file"] позволяет загрузить тот же файл снова
      event.target.value = '';
    }
  };
  
  const handleSingleImageTextFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleSingleImageTextFileSelect called'); // DEBUG
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const { url } = await onFileUpload(file);
        setTempSingleImageTextUrl(url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      event.target.value = '';
    }
  };
  
  const handleRemoveTempImage = (index: number) => {
    console.log('handleRemoveTempImage called for index:', index); // DEBUG
    setTempImageUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls[index] = undefined;
      return newUrls;
    });
  };
  
  const handleRemoveSingleImageText = () => {
    console.log('handleRemoveSingleImageText called'); // DEBUG
    setTempSingleImageTextUrl(undefined);
  };
  
  const handleAddBlock = (blockType: BlockType, initialData?: { items?: BlockItem[]; content?: string; }) => {
    console.log('BlocksPanel: Calling addBlock with type:', blockType, 'and initialData.items:', initialData?.items);
    addBlock(blockType, initialData);
    closeConfigMenu();
    setExpandedCategory(null);
  };
  
  // SVG Icons (без изменений)
  const ImageIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M3 16L7 12L10 15L15 10L21 16" strokeWidth="1.5" />
    </svg>
  );
  
  const TextIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 6H20" strokeWidth="1.5" />
      <path d="M4 12H20" strokeWidth="1.5" />
      <path d="M4 18H14" strokeWidth="1.5" />
    </svg>
  );
  
  const HeaderIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 4V20" strokeWidth="1.5" />
      <path d="M18 4V20" strokeWidth="1.5" />
      <path d="M6 12H18" strokeWidth="1.5" />
    </svg>
  );
  
  const QuoteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8 9H6C4.89543 9 4 9.89543 4 11V13C4 14.1046 4.89543 15 6 15H8C9.10457 15 10 14.1046 10 13V7L4 7" strokeWidth="1.5" />
      <path d="M18 9H16C14.8954 9 14 9.89543 14 11V13C14 14.1046 14.8954 15 16 15H18C19.1046 15 20 14.1046 20 13V7L14 7" strokeWidth="1.5" />
    </svg>
  );
  
  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 5V19" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 12H19" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  
  const CarouselIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="18" cy="12" r="1" fill="currentColor" />
    </svg>
  );
  
  const ArrowUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5"></path>
      <path d="M5 12L12 5L19 12"></path>
    </svg>
  );
  
  const ArrowDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5V19"></path>
      <path d="M19 12L12 19L5 12"></path>
    </svg>
  );
  
  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
  
  return (
    <div className={styles.blocksPanel}>
      <div className={styles.blocksPanel__categories}>
        
        {/* Категория: Фото */}
        <div className={styles.blocksPanel__category}>
          <button
            className={styles.blocksPanel__categoryHeader}
            onClick={() => toggleCategory('images')}
          >
            <span>Фото</span>
            <ImageIcon />
            {expandedCategory === 'images' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </button>
          
          {expandedCategory === 'images' && (
            <div className={styles.blocksPanel__options}>
              {/* Опция "Фотографии" - для IMAGES_2/3/4 */}
              <button
                className={`${styles.blocksPanel__option} ${selectedOption === 'IMAGES_OPTIONS' ? styles.activeOption : ''}`}
                onClick={() => selectOption('IMAGES_OPTIONS')}
              >
                <div className={styles.iconGroup}>
                  <ImageIcon />
                  <ImageIcon />
                </div>
                <span>Фотографии</span>
              </button>
              
              {/* Опция "Отдельное фото" - для PHOTO */}
              <button
                className={`${styles.blocksPanel__option} ${selectedOption === 'PHOTO_SINGLE' ? styles.activeOption : ''}`}
                onClick={() => selectOption('PHOTO_SINGLE')}
              >
                <ImageIcon />
                <span>Отдельное фото</span>
              </button>
              
              {/* Опции "Фото и текст" */}
              <button
                className={`${styles.blocksPanel__option} ${selectedOption === 'PHOTO_AND_TEXT_RIGHT' ? styles.activeOption : ''}`}
                onClick={() => selectOption('PHOTO_AND_TEXT_RIGHT')}
              >
                <div className={styles.iconGroup}>
                  <ImageIcon />
                  <TextIcon />
                </div>
                <span>Фото и текст (справа)</span>
              </button>
              
              <button
                className={`${styles.blocksPanel__option} ${selectedOption === 'PHOTO_AND_TEXT_LEFT' ? styles.activeOption : ''}`}
                onClick={() => selectOption('PHOTO_AND_TEXT_LEFT')}
              >
                <div className={styles.iconGroup}>
                  <TextIcon />
                  <ImageIcon />
                </div>
                <span>Фото и текст (слева)</span>
              </button>
              
              {/* Опция "Карусель" */}
              <button
                className={`${styles.blocksPanel__option} ${selectedOption === 'CAROUSEL_OPTIONS' ? styles.activeOption : ''}`}
                onClick={() => selectOption('CAROUSEEL_OPTIONS')}
              >
                <CarouselIcon />
                <span>Карусель</span>
              </button>
              
              {/* МЕНЮ НАСТРОЙКИ: "Фотографии" (для IMAGES_2/3/4) */}
              {selectedOption === 'IMAGES_OPTIONS' && (
                <div className={styles.blocksPanel__configMenu}>
                  <button className={styles.closeButton} onClick={closeConfigMenu}>
                    <CloseIcon />
                  </button>
                  <h3>Настройка фотогалереи</h3>
                  <div className={styles.optionConfig__header}>
                    <span>Количество фото:</span>
                    <div className={styles.photoCountControl}>
                      <button
                        onClick={() => handleNumPhotosChange(-1)}
                        disabled={numPhotos <= 1}
                        className={styles.photoCountButton}
                      >
                        -
                      </button>
                      <span>{numPhotos}</span>
                      <button
                        onClick={() => handleNumPhotosChange(1)}
                        disabled={numPhotos >= 4}
                        className={styles.photoCountButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.photoUploadGrid}>
                    {Array.from({ length: numPhotos }).map((_, index) => (
                      <div key={index} className={styles.photoUploadThumbnail}>
                        {tempImageUrls[index] ? (
                          <>
                            <img src={tempImageUrls[index]} alt={`Thumbnail ${index}`} />
                            <button
                              className={styles.removeThumbnailButton}
                              onClick={() => handleRemoveTempImage(index)}
                            >
                              X
                            </button>
                          </>
                        ) : (
                          <div
                            className={styles.placeholderThumbnail}
                            onClick={() => fileInputRefs.current[index]?.click()}
                          >
                            <PlusIcon />
                          </div>
                        )}
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[index] = el}
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelect(e, index)}
                          accept="image/*"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className={styles.addConfiguredBlockButton}
                    onClick={() => {
                      const validImageUrls = tempImageUrls.filter(url => url);
                      if (validImageUrls.length === 0) {
                        console.warn("No images selected for photo block.");
                        return;
                      }
                      let blockType: BlockType;
                      if (numPhotos === 1) blockType = 'PHOTO';
                      else if (numPhotos === 2) blockType = 'IMAGES_2';
                      else if (numPhotos === 3) blockType = 'IMAGES_3';
                      else blockType = 'IMAGES_4';
                      
                      // ИЗМЕНЕНИЕ ЗДЕСЬ: Передача validImageUrls в initialData.items
                      handleAddBlock(blockType, { items: validImageUrls.map(url => ({ image_url: url, id: Math.random().toString(36).substring(2, 11) })) });
                    }}
                    disabled={tempImageUrls.filter(url => url).length === 0}
                  >
                    Добавить
                  </button>
                </div>
              )}
              
              
              {/* МЕНЮ НАСТРОЙКИ: "Отдельное фото" (PHOTO) */}
              {selectedOption === 'PHOTO_SINGLE' && (
                <div className={styles.blocksPanel__configMenu}>
                  <button className={styles.closeButton} onClick={closeConfigMenu}>
                    <CloseIcon />
                  </button>
                  <h3>Добавить фото</h3>
                  <div className={styles.photoUploadGrid}>
                    <div className={styles.photoUploadThumbnail}>
                      {tempImageUrls[0] ? ( // Используем первый элемент tempImageUrls
                        <>
                          <img src={tempImageUrls[0]} alt="Thumbnail" />
                          <button
                            className={styles.removeThumbnailButton}
                            onClick={() => handleRemoveTempImage(0)}
                          >
                            X
                          </button>
                        </>
                      ) : (
                        <div
                          className={styles.placeholderThumbnail}
                          onClick={() => fileInputRefs.current[0]?.click()}
                        >
                          <PlusIcon />
                        </div>
                      )}
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[0] = el}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(e, 0)}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <button
                    className={styles.addConfiguredBlockButton}
                    onClick={() => {
                      if (!tempImageUrls[0]) { // Проверяем, что изображение загружено
                        console.warn("No image selected for single photo block.");
                        return;
                      }
                      // ИЗМЕНЕНИЕ ЗДЕСЬ: Передача tempImageUrls[0] в initialData.items
                      handleAddBlock('PHOTO', { items: [{ image_url: tempImageUrls[0], id: Math.random().toString(36).substring(2, 11) }] });
                    }}
                    disabled={!tempImageUrls[0]}
                  >
                    Добавить
                  </button>
                </div>
              )}
              
              {/* МЕНЮ НАСТРОЙКИ: "Фото и текст" (IMAGE_TEXT_RIGHT/LEFT) */}
              {(selectedOption === 'PHOTO_AND_TEXT_RIGHT' || selectedOption === 'PHOTO_AND_TEXT_LEFT') && (
                <div className={styles.blocksPanel__configMenu}>
                  <button className={styles.closeButton} onClick={closeConfigMenu}>
                    <CloseIcon />
                  </button>
                  <h3>Добавить фото и текст</h3>
                  <div className={styles.photoUploadGrid}>
                    <div className={styles.photoUploadThumbnail}>
                      {tempSingleImageTextUrl ? (
                        <>
                          <img src={tempSingleImageTextUrl} alt="Thumbnail" />
                          <button
                            className={styles.removeThumbnailButton}
                            onClick={handleRemoveSingleImageText}
                          >
                            X
                          </button>
                        </>
                      ) : (
                        <div
                          className={styles.placeholderThumbnail}
                          onClick={() => singleImageTextFileInputRef.current?.click()}
                        >
                          <PlusIcon />
                        </div>
                      )}
                      <input
                        type="file"
                        ref={singleImageTextFileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleSingleImageTextFileSelect}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Введите текст"
                    value={tempSingleImageTextContent}
                    onChange={(e) => setTempSingleImageTextContent(e.target.value)}
                    className={styles.configMenuTextarea}
                  />
                  <button
                    className={styles.addConfiguredBlockButton}
                    onClick={() => handleAddBlock(
                      selectedOption === 'PHOTO_AND_TEXT_RIGHT' ? 'IMAGE_TEXT_RIGHT' : 'IMAGE_TEXT_LEFT',
                      {
                        // ИЗМЕНЕНИЕ ЗДЕСЬ: Передача tempSingleImageTextUrl в initialData.items
                        items: tempSingleImageTextUrl ? [{ image_url: tempSingleImageTextUrl, id: Math.random().toString(36).substring(2, 11) }] : [],
                        content: tempSingleImageTextContent
                      }
                    )}
                    disabled={!tempSingleImageTextUrl && !tempSingleImageTextContent.trim()}
                  >
                    Добавить
                  </button>
                </div>
              )}
              
              {/* МЕНЮ НАСТРОЙКИ: "Карусель" (CAROUSEL / SLIDER) */}
              {selectedOption === 'CAROUSEL_OPTIONS' && (
                <div className={styles.blocksPanel__configMenu}>
                  <button className={styles.closeButton} onClick={closeConfigMenu}>
                    <CloseIcon />
                  </button>
                  <h3>Настройка карусели</h3>
                  <div className={styles.carouselTypeSelection}>
                    <button
                      className={`${styles.carouselTypeButton} ${tempCarouselType === 'CAROUSEL' ? styles.activeType : ''}`}
                      onClick={() => setTempCarouselType('CAROUSEL')}
                    >
                      Карусель
                    </button>
                    <button
                      className={`${styles.carouselTypeButton} ${tempCarouselType === 'SLIDER' ? styles.activeType : ''}`}
                      onClick={() => setTempCarouselType('SLIDER')}
                    >
                      Слайдер
                    </button>
                  </div>
                  <div className={styles.optionConfig__header}>
                    <span>Количество фото:</span>
                    <div className={styles.photoCountControl}>
                      <button
                        onClick={() => handleNumPhotosChange(-1)}
                        disabled={numPhotos <= 1}
                        className={styles.photoCountButton}
                      >
                        -
                      </button>
                      <span>{numPhotos}</span>
                      <button
                        onClick={() => handleNumPhotosChange(1)}
                        disabled={numPhotos >= 4}
                        className={styles.photoCountButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.photoUploadGrid}>
                    {Array.from({ length: numPhotos }).map((_, index) => (
                      <div key={index} className={styles.photoUploadThumbnail}>
                        {tempImageUrls[index] ? (
                          <>
                            <img src={tempImageUrls[index]} alt={`Thumbnail ${index}`} />
                            <button
                              className={styles.removeThumbnailButton}
                              onClick={() => handleRemoveTempImage(index)}
                            >
                              X
                            </button>
                          </>
                        ) : (
                          <div
                            className={styles.placeholderThumbnail}
                            onClick={() => fileInputRefs.current[index]?.click()}
                          >
                            <PlusIcon />
                          </div>
                        )}
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[index] = el}
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelect(e, index)}
                          accept="image/*"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className={styles.addConfiguredBlockButton}
                    onClick={() => handleAddBlock(
                      tempCarouselType,
                      // ИЗМЕНЕНИЕ ЗДЕСЬ: Передача отфильтрованных tempImageUrls в initialData.items
                      { items: tempImageUrls.filter(url => url).map(url => ({ image_url: url, id: Math.random().toString(36).substring(2, 11) })) }
                    )}
                    disabled={tempImageUrls.filter(url => url).length === 0}
                  >
                    Добавить
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Категория: Текст (без изменений) */}
        <div className={styles.blocksPanel__category}>
          <button
            className={styles.blocksPanel__categoryHeader}
            onClick={() => toggleCategory('text')}
          >
            <span>Текст</span>
            <TextIcon />
            {expandedCategory === 'text' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </button>
          
          {expandedCategory === 'text' && (
            <div className={styles.blocksPanel__options}>
              <button
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('HEADER', { content: 'Новый заголовок' })}
              >
                <HeaderIcon />
                <span>Заголовок</span>
              </button>
              
              <button
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('TEXT', { content: 'Новый текстовый блок' })}
              >
                <TextIcon />
                <span>Текстовый блок</span>
              </button>
              
              <button
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('QUOTE', { content: 'Новая цитата' })}
              >
                <QuoteIcon />
                <span>Цитата</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Категория: Сложные шаблоны (без изменений) */}
        <div className={styles.blocksPanel__category}>
          <button
            className={styles.blocksPanel__categoryHeader}
            onClick={() => toggleCategory('layouts')}
          >
            <span>Сложные шаблоны</span>
            {expandedCategory === 'layouts' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </button>
          
          {expandedCategory === 'layouts' && (
            <div className={styles.blocksPanel__options}>
              <button
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('LAYOUT_IMG_TEXT_IMG', {
                  items: [
                    { id: 'img1', type: 'image', image_url: '' },
                    { id: 'txt1', type: 'text', content: 'Текст в макете' },
                    { id: 'img2', type: 'image', image_url: '' },
                  ]
                })}
              >
                <div className={styles.iconGroup}>
                  <ImageIcon />
                  <TextIcon />
                  <ImageIcon />
                </div>
                <span>Изображение - Текст - Изображение</span>
              </button>
              
              <button
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('LAYOUT_TEXT_IMG_TEXT', {
                  items: [
                    { id: 'txt1', type: 'text', content: 'Текст в макете' },
                    { id: 'img1', type: 'image', image_url: '' },
                    { id: 'txt2', type: 'text', content: 'Текст в макете' },
                  ]
                })}
              >
                <div className={styles.iconGroup}>
                  <TextIcon />
                  <ImageIcon />
                  <TextIcon />
                </div>
                <span>Текст - Изображение - Текст</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocksPanel;
