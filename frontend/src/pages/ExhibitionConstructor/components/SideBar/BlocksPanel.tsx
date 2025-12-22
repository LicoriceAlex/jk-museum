import React, { useState } from 'react';
import styles from './BlocksPanel.module.scss';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { BlockItem, BlockType, ExhibitionBlock } from '../../types';

interface BlocksPanelProps {
  addBlock: (
    type: BlockType,
    initialData?: {
      items?: BlockItem[];
      content?: string;
      settings?: ExhibitionBlock['settings'];
    }
  ) => void;

  onFileUpload: (file: File) => Promise<{ url: string }>;
}

type CategoryKey = 'photo' | 'text';
type PhotoMenuKey = 'photo' | 'photoText' | 'carousel' | 'video';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const makeItem = (): BlockItem => ({ id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` } as BlockItem);
const makeItems = (count: number): BlockItem[] => Array.from({ length: count }, () => makeItem());

const BlocksPanel: React.FC<BlocksPanelProps> = ({ addBlock }) => {
  const [openCategory, setOpenCategory] = useState<CategoryKey>('photo');
  const [openPhotoMenu, setOpenPhotoMenu] = useState<PhotoMenuKey | null>('photo');

  const [photoCount, setPhotoCount] = useState<number>(1);

  const [ptTextCount, setPtTextCount] = useState<number>(1);
  const [ptPhotoCount, setPtPhotoCount] = useState<number>(1);

  const [carouselCount, setCarouselCount] = useState<number>(4); 
  const [carouselVariant, setCarouselVariant] = useState<'v1' | 'v2'>('v2');

  const toggleCategory = (key: CategoryKey) => setOpenCategory((prev) => (prev === key ? key : key));
  const togglePhotoMenu = (key: PhotoMenuKey) =>
    setOpenPhotoMenu((prev) => (prev === key ? null : key));

  const addPhotoBlock = () => {
    const count = clamp(photoCount, 1, 4);

    const typeByCount: Record<number, BlockType> = {
      1: 'IMAGE_UPLOAD',
      2: 'IMAGES_2',
      3: 'IMAGES_3',
      4: 'IMAGES_4',
    };

    addBlock(typeByCount[count], { items: makeItems(count) });
  };

  const addPhotoTextBlock = () => {
    if (ptTextCount === 2 && ptPhotoCount === 1) {
      addBlock('LAYOUT_TEXT_IMG_TEXT', {
        items: makeItems(1),
        settings: { text_left_html: '', text_right_html: '' },
      });
      return;
    }

    if (ptTextCount === 1 && ptPhotoCount === 2) {
      addBlock('LAYOUT_IMG_TEXT_IMG', {
        items: makeItems(2),
        content: '',
      });
      return;
    }

    addBlock('IMAGE_TEXT_LEFT', {
      items: makeItems(1),
      content: '',
    });
  };

  const addCarouselBlock = () => {
    const count = clamp(carouselCount, 1, 4);
    if (carouselVariant === 'v2') {
      addBlock('SLIDER', { items: makeItems(count) });
    } else {
      addBlock('CAROUSEL', { items: makeItems(count) });
    }
  };

  const decPtText = () => setPtTextCount(1);
  const incPtText = () => {
    setPtTextCount(2);
    setPtPhotoCount(1);
  };

  const decPtPhoto = () => setPtPhotoCount(1);
  const incPtPhoto = () => {
    setPtPhotoCount(2);
    setPtTextCount(1);
  };

  const canIncPtText = ptTextCount === 1 && ptPhotoCount === 1;
  const canIncPtPhoto = ptPhotoCount === 1 && ptTextCount === 1;

  return (
    <div className={styles.root}>
      {/* ===== Фото и видео ===== */}
      <div className={styles.category}>
        <button type="button" className={styles.categoryHeader} onClick={() => toggleCategory('photo')}>
          <span>Фото и видео</span>
          {openCategory === 'photo' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {openCategory === 'photo' && (
          <div className={styles.categoryBody}>
            {/* Фото */}
            <div className={styles.menuItem}>
              <button type="button" className={styles.menuHeader} onClick={() => togglePhotoMenu('photo')}>
                <span>Фото</span>
                <span className={styles.menuIcon}>🖼️</span>
              </button>

              {openPhotoMenu === 'photo' && (
                <div className={styles.menuBody}>
                  <div className={styles.row}>
                    <div className={styles.label}>Фотографии</div>
                    <div className={styles.stepper}>
                      <button
                        type="button"
                        className={styles.stepBtn}
                        onClick={() => setPhotoCount((v) => clamp(v - 1, 1, 4))}
                        disabled={photoCount <= 1}
                      >
                        −
                      </button>
                      <div className={styles.stepValue}>{photoCount}</div>
                      <button
                        type="button"
                        className={styles.stepBtn}
                        onClick={() => setPhotoCount((v) => clamp(v + 1, 1, 4))}
                        disabled={photoCount >= 4}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button type="button" className={styles.addBtn} onClick={addPhotoBlock}>
                    Добавить
                  </button>
                </div>
              )}
            </div>

            {/* Фото и текст */}
            <div className={styles.menuItem}>
              <button type="button" className={styles.menuHeader} onClick={() => togglePhotoMenu('photoText')}>
                <span>Фото и текст</span>
                <span className={styles.menuIcon}>🖼️≡</span>
              </button>

              {openPhotoMenu === 'photoText' && (
                <div className={styles.menuBody}>
                  <div className={styles.row}>
                    <div className={styles.label}>Блок текста</div>
                    <div className={styles.stepper}>
                      <button type="button" className={styles.stepBtn} onClick={decPtText} disabled={ptTextCount <= 1}>
                        −
                      </button>
                      <div className={styles.stepValue}>{ptTextCount}</div>
                      <button type="button" className={styles.stepBtn} onClick={incPtText} disabled={!canIncPtText}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.label}>Фотографии</div>
                    <div className={styles.stepper}>
                      <button type="button" className={styles.stepBtn} onClick={decPtPhoto} disabled={ptPhotoCount <= 1}>
                        −
                      </button>
                      <div className={styles.stepValue}>{ptPhotoCount}</div>
                      <button type="button" className={styles.stepBtn} onClick={incPtPhoto} disabled={!canIncPtPhoto}>
                        +
                      </button>
                    </div>
                  </div>

                  <button type="button" className={styles.addBtn} onClick={addPhotoTextBlock}>
                    Добавить
                  </button>
                </div>
              )}
            </div>

            {/* Карусель */}
            <div className={styles.menuItem}>
              <button type="button" className={styles.menuHeader} onClick={() => togglePhotoMenu('carousel')}>
                <span>Карусель</span>
                <span className={styles.menuIcon}>⇆</span>
              </button>

              {openPhotoMenu === 'carousel' && (
                <div className={styles.menuBody}>
                  <div className={styles.subTitle}>Вид карусели</div>

                  <div className={styles.variantRow}>
                    <button
                      type="button"
                      className={`${styles.variantBtn} ${carouselVariant === 'v1' ? styles.variantBtnActive : ''}`}
                      onClick={() => setCarouselVariant('v1')}
                      aria-label="Вид карусели 1"
                    >
                      <div className={styles.variantThumbV1} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.variantBtn} ${carouselVariant === 'v2' ? styles.variantBtnActive : ''}`}
                      onClick={() => setCarouselVariant('v2')}
                      aria-label="Вид карусели 2"
                    >
                      <div className={styles.variantThumbV2} />
                    </button>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.label}>Фотографии</div>
                    <div className={styles.stepper}>
                      <button
                        type="button"
                        className={styles.stepBtn}
                        onClick={() => setCarouselCount((v) => clamp(v - 1, 1, 4))}
                        disabled={carouselCount <= 1}
                      >
                        −
                      </button>
                      <div className={styles.stepValue}>{carouselCount}</div>
                      <button
                        type="button"
                        className={styles.stepBtn}
                        onClick={() => setCarouselCount((v) => clamp(v + 1, 1, 4))}
                        disabled={carouselCount >= 4}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button type="button" className={styles.addBtn} onClick={addCarouselBlock}>
                    Добавить
                  </button>
                </div>
              )}
            </div>

            {/* Видео */}
            <div className={styles.menuItem}>
              <button type="button" className={styles.menuHeader} onClick={() => togglePhotoMenu('video')}>
                <span>Видео</span>
                <span className={styles.menuIcon}>▶</span>
              </button>

              {openPhotoMenu === 'video' && (
                <div className={styles.menuBody}>
                  <button type="button" className={styles.addBtn} onClick={() => addBlock('VIDEO', { settings: { video_url: '' } })}>
                    Добавить
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== Текст ===== */}
      <div className={styles.category}>
        <button type="button" className={styles.categoryHeader} onClick={() => toggleCategory('text')}>
          <span>Текст</span>
          {openCategory === 'text' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {openCategory === 'text' && (
          <div className={styles.textList}>
            <div className={styles.textRow}>
              <div className={styles.textRowTitle}>Текст</div>
              <button type="button" className={styles.textAddBtn} onClick={() => addBlock('TEXT', { content: '' })}>
                Добавить
              </button>
            </div>

            <div className={styles.textRow}>
              <div className={styles.textRowTitle}>Заголовок</div>
              <button type="button" className={styles.textAddBtn} onClick={() => addBlock('HEADER', { content: '' })}>
                Добавить
              </button>
            </div>

            <div className={styles.textRow}>
              <div className={styles.textRowTitle}>Цитата</div>
              <button type="button" className={styles.textAddBtn} onClick={() => addBlock('QUOTE', { content: '' })}>
                Добавить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlocksPanel;
