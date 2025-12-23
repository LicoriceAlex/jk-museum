import React from 'react';
import { ExhibitionBlock, FontSettings, ColorSettings } from '../../types';

import HeaderBlock from '../BlockComponents/HeaderBlock/HeaderBlock';
import TextBlock from '../BlockComponents/TextBlock/TextBlock';
import QuoteBlock from '../BlockComponents/QuoteBlock/QuoteBlock';
import ImageTextBlock from '../BlockComponents/ImageTextBlock/ImageTextBlock';
import ImagesGridBlock from '../BlockComponents/ImagesGridBlock/ImagesGridBlock';
import ImageBlock from '../BlockComponents/ImageBlock/ImageBlock';
import LayoutImgTextImgBlock from '../BlockComponents/LayoutImgTextImgBlock/LayoutImgTextImgBlock';
import LayoutTextImgTextBlock from '../BlockComponents/LayoutTextImgTextBlock/LayoutTextImgTextBlock';
import CarouselBlock from '../BlockComponents/CarouselBlock/CarouselBlock';
import SliderBlock from '../BlockComponents/SliderBlock/SliderBlock';

import styles from './BlockPreview.module.scss';

interface BlockPreviewProps {
  block: ExhibitionBlock;
  updateBlock: (blockId: string, updatedFields: Partial<ExhibitionBlock>) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
}

const BlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  updateBlock,
  removeBlock,
  moveBlock,
  fontSettings,
  colorSettings,
  onImageUpload,
  onImageRemove,
}) => {
  // Стиль для обычного текста
  const textStyle: React.CSSProperties = {
    fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
    fontWeight:
      fontSettings.bodyWeight === 'Normal'
        ? 'normal'
        : fontSettings.bodyWeight === 'Bold'
          ? 'bold'
          : fontSettings.bodyWeight === 'Light'
            ? 300
            : 'normal',
    fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
    color: colorSettings.text,
    fontSize: `${fontSettings.fontSize}px`,
  };

  // Стиль для заголовков
  const headerStyle: React.CSSProperties = {
    fontFamily: fontSettings.titleFont,
    fontWeight:
      fontSettings.titleWeight === 'Normal'
        ? 'normal'
        : fontSettings.titleWeight === 'Bold'
          ? 'bold'
          : fontSettings.titleWeight === 'Light'
            ? 300
            : 'normal',
    fontStyle: fontSettings.titleWeight === 'Italic' ? 'italic' : 'normal',
    fontSize: `${fontSettings.fontSize * 1.5}px`,
    color: colorSettings.primary,
  };

  const content = (() => {
    switch (block.type) {
      case 'HEADER':
        return (
          <HeaderBlock
            content={block.content || ''}
            style={headerStyle}
            onContentChange={(newContent) => updateBlock(block.id, { content: newContent })}
          />
        );

      case 'TEXT':
        return (
          <TextBlock
            initialContent={block.content || ''}
            onContentChange={(newContent) => updateBlock(block.id, { content: newContent })}
            style={textStyle}
            placeholder="Нажмите, чтобы добавить текст."
          />
        );

      case 'QUOTE':
        return (
          <QuoteBlock
            content={block.content || ''}
            settings={block.settings}
            onUpdate={(updatedData: Partial<ExhibitionBlock>) => updateBlock(block.id, updatedData)}
            style={textStyle}
          />
        );

      case 'IMAGE_UPLOAD':
        return (
          <ImageBlock
            imageUrl={block.items?.[0]?.image_url}
            onUpload={(file) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            containerStyle={{ height: 576 }}
            imageStyle={{ height: '100%', objectFit: 'cover' }}
          />
        );

      case 'IMAGES_2':
        return (
          <ImagesGridBlock
            blockId={block.id}
            items={block.items || []}
            columns={2}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );

      case 'IMAGES_3':
        return (
          <ImagesGridBlock
            blockId={block.id}
            items={block.items || []}
            columns={3}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );

      case 'IMAGES_4':
        return (
          <ImagesGridBlock
            blockId={block.id}
            items={block.items || []}
            columns={4} 
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );

      case 'IMAGE_TEXT_RIGHT':
      case 'IMAGE_TEXT_LEFT':
        return (
          <ImageTextBlock
            blockId={block.id}
            content={block.content || ''}
            imageUrl={block.items?.[0]?.image_url}
            imagePosition={block.type === 'IMAGE_TEXT_RIGHT' ? 'right' : 'left'}
            style={textStyle}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            updateBlock={updateBlock}
          />
        );

      case 'LAYOUT_IMG_TEXT_IMG':
        return (
          <LayoutImgTextImgBlock
            blockId={block.id}
            items={block.items || []}
            content={block.content || ''}
            style={textStyle}
            updateBlock={updateBlock}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );

      case 'LAYOUT_TEXT_IMG_TEXT':
        return (
          <LayoutTextImgTextBlock
            blockId={block.id}
            leftText={block.settings?.text_left_html || ''}
            rightText={block.settings?.text_right_html || ''}
            imageUrl={block.items?.[0]?.image_url}
            style={textStyle}
            updateBlock={updateBlock}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );

      case 'CAROUSEL':
        return (
          <CarouselBlock
            blockId={block.id}
            items={block.items || []}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );

      case 'SLIDER':
        return (
          <SliderBlock
            blockId={block.id}
            items={block.items || []}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
          />
        );


      default:
        return null;
    }
  })();

  return (
    <div className={styles.blockPreviewWrapper}>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => moveBlock(block.id, 'up')}
          className={styles.controlButton}
          title="Вверх"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => moveBlock(block.id, 'down')}
          className={styles.controlButton}
          title="Вниз"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => removeBlock(block.id)}
          className={`${styles.controlButton} ${styles.removeButton}`}
          title="Удалить"
        >
          ✕
        </button>
      </div>

      <div className={styles.blockPreviewContent}>{content}</div>
    </div>
  );
};

export default BlockPreview;
