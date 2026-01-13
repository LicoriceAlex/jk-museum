import React, { useState, useRef, useEffect } from 'react';
import { ExhibitionBlock, FontSettings, ColorSettings } from '../../types';

import HeaderBlock from '../BlockComponents/HeaderBlock/HeaderBlock';
import TextBlock from '../BlockComponents/TextBlock/TextBlock';
import QuoteBlock from '../BlockComponents/QuoteBlock/QuoteBlock';
import ImageTextBlock from '../BlockComponents/ImageTextBlock/ImageTextBlock';
import ImagesGridBlock from '../BlockComponents/ImagesGridBlock/ImagesGridBlock';
import ImageBlock from '../BlockComponents/ImageBlock/ImageBlock';
import ExhibitBlock from '../BlockComponents/ExhibitBlock/ExhibitBlock';
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
  moveBlockToPosition?: (blockId: string, newPosition: number) => void;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  index?: number;
  onDragStart?: (e: React.DragEvent, blockId: string) => void;
  onDragOver?: (e: React.DragEvent, blockId: string) => void;
  onDrop?: (e: React.DragEvent, blockId: string) => void;
  isDragging?: boolean;
  dragOverBlockId?: string | null;
}

const BlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  updateBlock,
  removeBlock,
  moveBlock,
  moveBlockToPosition,
  fontSettings,
  colorSettings,
  onImageUpload,
  onImageRemove,
  index = 0,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  dragOverBlockId = null,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const blockRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Размер шрифта для блока (может быть переопределен в settings)
  const blockFontSize = block.settings?.fontSize || fontSettings.fontSize;
  const blockWidth = block.settings?.width;
  const blockHeight = block.settings?.height;

  // Обработчики для resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setResizeStartSize({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!blockRef.current) return;
      
      const deltaX = e.clientX - resizeStartPos.x;
      const deltaY = e.clientY - resizeStartPos.y;
      
      const newWidth = Math.max(200, resizeStartSize.width + deltaX);
      const newHeight = Math.max(100, resizeStartSize.height + deltaY);
      
      updateBlock(block.id, {
        settings: {
          ...block.settings,
          width: newWidth,
          height: newHeight,
        },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStartPos, resizeStartSize, block, updateBlock]);

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
    fontSize: `${blockFontSize}px`,
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

  const blockStyle: React.CSSProperties = {
    width: blockWidth ? `${blockWidth}px` : '100%',
    height: blockHeight ? `${blockHeight}px` : 'auto',
    minHeight: blockHeight ? `${blockHeight}px` : 'auto',
    opacity: isDragging ? 0.5 : 1,
    border: dragOverBlockId === block.id ? '2px dashed #1F3B2C' : 'none',
  };

  return (
    <div
      ref={blockRef}
      className={`${styles.blockPreviewWrapper} ${isDragging ? styles.dragging : ''} ${dragOverBlockId === block.id ? styles.dragOver : ''}`}
      style={blockStyle}
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e, block.id)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver?.(e, block.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop?.(e, block.id);
      }}
    >
      <div className={styles.dragHandle} title="Перетащите для перемещения">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="4" r="1.5"/>
          <circle cx="12" cy="4" r="1.5"/>
          <circle cx="4" cy="8" r="1.5"/>
          <circle cx="12" cy="8" r="1.5"/>
          <circle cx="4" cy="12" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
        </svg>
      </div>

      <button
        type="button"
        onClick={() => removeBlock(block.id)}
        className={styles.removeButton}
        title="Удалить блок"
      >
        ✕
      </button>

      <div className={styles.blockPreviewContent}>{content}</div>

      <div
        ref={resizeHandleRef}
        className={styles.resizeCorner}
        onMouseDown={handleResizeStart}
        title="Изменить размер"
      />
    </div>
  );
};

export default BlockPreview;
