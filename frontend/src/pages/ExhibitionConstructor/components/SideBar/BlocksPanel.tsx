// components/BlocksPanel/BlocksPanel.tsx
import React, { useState, useRef } from 'react';
import { BlockType, BlockItem } from '../../types';
import styles from './BlocksPanel.module.scss';
import {
  AlignLeft,
  AlignRight,
  ChevronDown, GalleryHorizontal,
  GalleryHorizontalEnd
} from 'lucide-react';

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
  const singleImageTextFileInputRef = useRef<HTMLInputElement>(null);
  
  const [tempImageTextSide, setTempImageTextSide] = useState<'right' | 'left'>('right');
  
  
  
  const toggleCategory = (category: string) => {
    console.log('toggleCategory called with:', category);
    setExpandedCategory(prev => (prev === category ? null : category));
    setSelectedOption(null);
    resetCurrentOptionConfig();
  };
  
  const selectOption = (option: string) => {
    console.log('selectOption called with:', option);
    if (selectedOption === option) {
      setSelectedOption(null);
      resetCurrentOptionConfig();
    } else {
      setSelectedOption(option);
      resetCurrentOptionConfig();
      if (option === 'IMAGES_OPTIONS') {
        setNumPhotos(0);
        setTempImageUrls([]);
      } else if (option === 'CAROUSEL_OPTIONS' || option === 'PHOTO_SINGLE') {
        setNumPhotos(0);
        setTempImageUrls([].fill(undefined));
      } else if (option === 'IMAGE_TEXT_BLOCK') {
        setTempSingleImageTextUrl(undefined);
        setTempImageTextSide('right');
      }
    }
  };
  
  const resetCurrentOptionConfig = () => {
    console.log('resetCurrentOptionConfig called');
    setNumPhotos(1);
    setTempImageUrls([]);
    setTempCarouselType('CAROUSEL');
    setTempSingleImageTextUrl(undefined);
    setTempImageTextSide('right');
  };
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
    console.log('handleFileSelect called for index:', index);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const { url } = await onFileUpload(file);
        setTempImageUrls(prevUrls => {
          const newUrls = [...prevUrls];
          while(newUrls.length <= index) {
            newUrls.push(undefined);
          }
          newUrls[index] = url;
          return newUrls;
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      event.target.value = '';
    }
  };
  
  const handleSingleImageTextFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleSingleImageTextFileSelect called');
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
    console.log('handleRemoveTempImage called for index:', index);
    setTempImageUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };
  
  const handleRemoveSingleImageText = () => {
    console.log('handleRemoveSingleImageText called');
    setTempSingleImageTextUrl(undefined);
  };
  
  const handleAddBlock = (blockType: BlockType, initialData?: { items?: BlockItem[]; content?: string; }) => {
    console.log('BlocksPanel: Calling addBlock with type:', blockType, 'and initialData.items:', initialData?.items, 'content:', initialData?.content);
    addBlock(blockType, initialData);
    setSelectedOption(null);
    setExpandedCategory(null);
    resetCurrentOptionConfig();
  };
  
  const toggleImageTextSide = () => {
    setTempImageTextSide(prevSide => (prevSide === 'right' ? 'left' : 'right'));
  };
  
  const ImageIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8 9H6C4.89543 9 4 9.89543 4 11V13C4 14.1046 4.89543 15 6 15H8C9.10457 15 10 14.1046 10 13V7L4 7" strokeWidth="1.5" />
      <path d="M18 9H16C14.8954 9 14 9.89543 14 11V13C14 14.1046 14.8954 15 16 15H18C19.1046 15 20 14.1046 20 13V7L14 7" strokeWidth="1.5" />
    </svg>
  );
  
  const PlusIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
  
  return (
    <div className={styles.blocksPanel}>
      <div className={styles.blocksPanel__categories}>
        
        <div className={styles.blocksPanel__category}>
          <button
            className={styles.blocksPanel__categoryHeader}
            onClick={() => toggleCategory('images')}
          >
            <span>Фото</span>
            <ChevronDown
              size={36}
              className={`${styles.arrowIcon} ${expandedCategory === 'images' ? styles.arrowIconActive : ''}`}
            />
          </button>
          
          {expandedCategory === 'images' && (
            <div className={styles.blocksPanel__options}>
              <div
                className={`${styles.blocksPanel__option} ${selectedOption === 'IMAGES_OPTIONS' ? styles.activeOption : ''}`}
                onClick={() => selectOption('IMAGES_OPTIONS')}
              >
                <span>Фото</span>
                <div className={styles.iconGroup}>
                  <ImageIcon/>
                </div>
              
              </div>
              
              {selectedOption === 'IMAGES_OPTIONS' && (
                <div className={styles.blocksPanel__configMenu}>
                  <h3>Фотографии</h3>
                  <div className={styles.photoUploadGrid}>
                    {tempImageUrls.length === 0 && (
                      <div
                        className={styles.placeholderThumbnail}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.style.display = 'none';
                          document.body.appendChild(input);
                          
                          input.onchange = (e) => {
                            handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>, 0);
                            document.body.removeChild(input);
                          };
                          input.click();
                        }}
                      >
                        <PlusIcon />
                      </div>
                    )}
                    
                    {tempImageUrls.length > 0 && Array.from({ length: Math.min(tempImageUrls.length + (tempImageUrls.length < 4 ? 1 : 0), 4) }).map((_, index) => {
                      const imageUrl = tempImageUrls[index];
                      
                      return (
                        <div key={index} className={styles.photoUploadThumbnail}
                             onClick={() => fileInputRefs.current[index]?.click()}>
                          {imageUrl ? (
                            <>
                              <img src={imageUrl} alt={`Thumbnail ${index}`} />
                              <button
                                className={styles.removeThumbnailButton}
                                onClick={(e) => { e.stopPropagation(); handleRemoveTempImage(index); }}
                              >
                                X
                              </button>
                            </>
                          ) : (
                            <div
                              className={styles.placeholderThumbnail}
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
                      );
                    })}
                  </div>
                  <div className={styles.addButtonWrapper}>
                    <button
                      className={styles.addConfiguredBlockButton}
                      onClick={() => {
                        const validImageUrls = tempImageUrls.filter(url => url);
                        if (validImageUrls.length === 0) {
                          console.warn("No images selected for photo block.");
                          return;
                        }
                        let blockType: BlockType;
                        if (validImageUrls.length === 1) blockType = 'PHOTO';
                        else if (validImageUrls.length === 2) blockType = 'IMAGES_2';
                        else if (validImageUrls.length === 3) blockType = 'IMAGES_3';
                        else blockType = 'IMAGES_4';
                        
                        handleAddBlock(blockType, { items: validImageUrls.map(url => ({ image_url: url, id: Math.random().toString(36).substring(2, 11) })) });
                      }}
                      disabled={tempImageUrls.filter(url => url).length === 0}
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              )}
              
              <div
                className={`${styles.blocksPanel__option} ${selectedOption === 'IMAGE_TEXT_BLOCK' ? styles.activeOption : ''}`}
                onClick={() => selectOption('IMAGE_TEXT_BLOCK')}
              >
                <span>Фото и текст</span>
                <div className={styles.iconGroup}>
                  <ImageIcon/>
                  <TextIcon/>
                </div>
              </div>
              
              {selectedOption === 'IMAGE_TEXT_BLOCK' && (
                <div className={styles.blocksPanel__configMenu}>
                  <h3>Добавить фото и текст</h3>
                  <div className={styles.photoUploadGrid}>
                    <div className={styles.photoUploadThumbnail}
                         onClick={() => singleImageTextFileInputRef.current?.click()}>
                      {tempSingleImageTextUrl ? (
                        <>
                          <img src={tempSingleImageTextUrl} alt="Thumbnail"/>
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
                        >
                          <PlusIcon/>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={singleImageTextFileInputRef}
                        style={{display: 'none'}}
                        onChange={handleSingleImageTextFileSelect}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className={styles.textSideSelection}>
                    <label>Положение текста:</label>
                    <div
                      className={styles.toggleAlignButton}
                      onClick={toggleImageTextSide}
                      title={tempImageTextSide === 'right' ? 'Текст справа' : 'Текст слева'}
                    >
                      {tempImageTextSide === 'right' ? (
                        <AlignRight size={24} />
                      ) : (
                        <AlignLeft size={24} />
                      )}
                    </div>
                  </div>
                  <button
                    className={styles.addConfiguredBlockButton}
                    onClick={() => handleAddBlock(
                      tempImageTextSide === 'right' ? 'IMAGE_TEXT_RIGHT' : 'IMAGE_TEXT_LEFT',
                      {
                        items: tempSingleImageTextUrl ? [{
                          image_url: tempSingleImageTextUrl,
                          id: Math.random().toString(36).substring(2, 11)
                        }] : [],
                        // Pass default placeholder text for the content
                        content: 'Добавьте свой текст здесь'
                      }
                    )}
                    disabled={!tempSingleImageTextUrl}
                  >
                    Добавить
                  </button>
                </div>
              )}
              
              <div
                className={`${styles.blocksPanel__option} ${selectedOption === 'CAROUSEL_OPTIONS' ? styles.activeOption : ''}`}
                onClick={() => selectOption('CAROUSEL_OPTIONS')}
              >
                <span>Карусель</span>
                <CarouselIcon/>
              
              </div>
              {selectedOption === 'CAROUSEL_OPTIONS' && (
                <div className={styles.blocksPanel__configMenu}>
                  <h3>Вид карусели</h3>
                  <div className={styles.carouselTypeSelection}>
                    <button
                      className={`${styles.carouselTypeButton} ${tempCarouselType === 'CAROUSEL' ? styles.activeType : ''}`}
                      onClick={() => setTempCarouselType('CAROUSEL')}
                      title="Карусель"
                    >
                      <GalleryHorizontalEnd size={24}/>
                    </button>
                    <button
                      className={`${styles.carouselTypeButton} ${tempCarouselType === 'SLIDER' ? styles.activeType : ''}`}
                      onClick={() => setTempCarouselType('SLIDER')}
                      title="Слайдер"
                    >
                      <GalleryHorizontal size={24}/>
                    </button>
                  </div>
                  <div className={styles.photoUploadGrid}>
                    {/* Отображаем загруженные миниатюры */}
                    {tempImageUrls.map((imageUrl, index) => (
                      <div key={index} className={styles.photoUploadThumbnail}>
                        {imageUrl ? (
                          <>
                            <img src={imageUrl} alt={`Thumbnail ${index}`} />
                            <button
                              className={styles.removeThumbnailButton}
                              onClick={(e) => { e.stopPropagation(); handleRemoveTempImage(index); }}
                            >
                              X
                            </button>
                          </>
                        ) : null}
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[index] = el}
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelect(e, index)}
                          accept="image/*"
                        />
                      </div>
                    ))}
                    
                    {tempImageUrls.length < 4 && (
                      <div
                        className={styles.photoUploadThumbnail}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.style.display = 'none';
                          document.body.appendChild(input);
                          
                          input.onchange = (e) => {
                            handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>, tempImageUrls.length);
                            document.body.removeChild(input);
                          };
                          input.click();
                        }}
                      >
                        <div className={styles.placeholderThumbnail}>
                          <PlusIcon />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className={styles.addConfiguredBlockButton}
                    onClick={() => handleAddBlock(
                      tempCarouselType,
                      {
                        items: tempImageUrls.filter(url => url).map(url => ({
                          image_url: url,
                          id: Math.random().toString(36).substring(2, 11)
                        }))
                      }
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
        
        <div className={styles.blocksPanel__category}>
          <div
            className={styles.blocksPanel__categoryHeader}
            onClick={() => toggleCategory('text')}
          >
            <span>Текст</span>
            <ChevronDown
              size={36}
              className={`${styles.arrowIcon} ${expandedCategory === 'text' ? styles.arrowIconActive : ''}`}
            />
          </div>
          
          {expandedCategory === 'text' && (
            <div className={styles.blocksPanel__options}>
              <div
                className={`${styles.blocksPanel__option} ${selectedOption === 'HEADER_BLOCK' ? styles.activeOption : ''}`}
                onClick={() => handleAddBlock('HEADER', { content: 'Новый заголовок' })}
              >
                <span>Заголовок</span>
                <HeaderIcon/>
              </div>
              
              <div
                className={`${styles.blocksPanel__option} ${selectedOption === 'TEXT_BLOCK' ? styles.activeOption : ''}`}
                onClick={() => handleAddBlock('TEXT', { content: 'Новый текстовый блок' })}
              >
                <span>Текстовый блок</span>
                <TextIcon/>
              </div>
              
              <div
                className={`${styles.blocksPanel__option} ${selectedOption === 'QUOTE_BLOCK' ? styles.activeOption : ''}`}
                onClick={() => handleAddBlock('QUOTE', { content: 'Новая цитата' })}
              >
                <span>Цитата</span>
                <QuoteIcon/>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.blocksPanel__category}>
          <div
            className={styles.blocksPanel__categoryHeader}
            onClick={() => toggleCategory('layouts')}
          >
            <span>Шаблоны</span>
            <div
              className={styles.iconGroup}>
            </div>
            <ChevronDown
              size={36}
              className={`${styles.arrowIcon} ${expandedCategory === 'layouts' ? styles.arrowIconActive : ''}`}
            />
          </div>
          
          {expandedCategory === 'layouts' && (
            <div className={styles.blocksPanel__options}>
              <div
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('LAYOUT_IMG_TEXT_IMG', {
                  items: [
                    {id: 'img1', type: 'image', image_url: ''},
                    {id: 'txt1', type: 'text', content: 'Текст в макете'},
                    {id: 'img2', type: 'image', image_url: ''}
                  ]
                })}
              >
                <span>Фото(2) и текст</span>
                <div className={styles.iconGroup}>
                  <ImageIcon/>
                  <TextIcon/>
                  <ImageIcon/>
                </div>
              </div>
              
              <div
                className={styles.blocksPanel__option}
                onClick={() => handleAddBlock('LAYOUT_TEXT_IMG_TEXT', {
                  items: [
                    {id: 'txt1', type: 'text', content: 'Текст в макете'},
                    {id: 'img1', type: 'image', image_url: ''},
                    {id: 'txt2', type: 'text', content: 'Текст в макете'}
                  ]
                })}
              >
                <span>Фото и текст(2)</span>
                <div className={styles.iconGroup}>
                  <TextIcon/>
                  <ImageIcon/>
                  <TextIcon/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocksPanel;
