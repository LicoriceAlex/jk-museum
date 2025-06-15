// components/Preview/BlockPreview.tsx
import React from 'react';
import { ExhibitionBlock, FontSettings, ColorSettings} from '../../types';
import HeaderBlock from '../BlockComponents/HeaderBlock/HeaderBlock.tsx';
import TextBlock from '../BlockComponents/TextBlock/TextBlock.tsx';
import QuoteBlock from '../BlockComponents/QuoteBlock/QuoteBlock.tsx';
import ImageBlock from '../BlockComponents/ImageBlock/ImageBlock.tsx';
import ImageGridBlock from '../BlockComponents/ImagesGridBlock/ImagesGridBlock.tsx';
import CarouselBlock from '../BlockComponents/CarouselBlock/CarouselBlock.tsx';
import ImageTextBlock from '../BlockComponents/ImageTextBlock/ImageTextBlock.tsx';
import LayoutImgTextImgBlock from '../BlockComponents/LayoutImgTextImgBlock/LayoutImgTextImgBlock.tsx';
import LayoutTextImgTextBlock from '../BlockComponents/LayoutTextImgTextBlock/LayoutTextImgTextBlock.tsx';
import PhotoBlock from '../BlockComponents/PhotoBlock/PhotoBlock.tsx';
import SliderBlock from '../BlockComponents/SliderBlock/SliderBlock.tsx';
import styles from './BlockPreview.module.scss'

interface BlockPreviewProps {
  block: ExhibitionBlock;
  fontSettings: FontSettings;
  colorSettings: ColorSettings;
  onImageUpload: (blockId: string, index: number, file: File) => void;
  onImageRemove: (blockId: string, index: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
}

const BlockPreview: React.FC<BlockPreviewProps> = ({
                                                     block,
                                                     fontSettings,
                                                     colorSettings,
                                                     onImageUpload,
                                                     onImageRemove,
                                                     updateBlock,
                                                     removeBlock,
                                                     moveBlock
                                                   }) => {
  
  const textStyle = {
    fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
    fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
      fontSettings.bodyWeight === 'Bold' ? 'bold' :
        fontSettings.bodyWeight === 'Light' ? 300 :
          'normal',
    fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
    color: colorSettings.text,
    fontSize: `${fontSettings.fontSize}px`
  };
  
  const headerStyle = {
    fontFamily: fontSettings.titleFont,
    fontWeight: fontSettings.titleWeight === 'Normal' ? 'normal' :
      fontSettings.titleWeight === 'Bold' ? 'bold' :
        fontSettings.titleWeight === 'Light' ? 300 :
          'normal',
    fontStyle: fontSettings.titleWeight === 'Italic' ? 'italic' : 'normal',
    fontSize: `${fontSettings.fontSize * 1.5}px`,
    color: colorSettings.primary
  };
  
  
  const renderBlockContent = () => {
    const getImageUrl = (itemIndex: number): string | undefined => {
      return block.items?.[itemIndex]?.image_url;
    };
    
    switch (block.type) {
      case 'HEADER':
        return (
          <HeaderBlock
            content={block.content || ''}
            style={headerStyle}
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
      
      case 'IMAGE':
        return (
          <ImageBlock
            imageUrl={getImageUrl(0)}
            onUpload={(file: File) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            style={textStyle}
          />
        );
      
      case 'IMAGE_UPLOAD':
        return (
          <ImageBlock
            imageUrl={getImageUrl(0)}
            onUpload={(file: File) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            style={textStyle}
          />
        );
      
      case 'IMAGES_2':
        return (
          <ImageGridBlock
            images={(block.items || []).slice(0, 2)}
            onUpload={(index, file) => onImageUpload(block.id, index, file)}
            onRemove={(index) => onImageRemove(block.id, index)}
            style={textStyle}
            columns={2}
          />
        );
      
      case 'IMAGES_3':
        return (
          <ImageGridBlock
            images={(block.items || []).slice(0, 3)}
            onUpload={(index, file) => onImageUpload(block.id, index, file)}
            onRemove={(index) => onImageRemove(block.id, index)}
            style={textStyle}
            columns={3}
          />
        );
      
      case 'IMAGES_4':
        return (
          <ImageGridBlock
            images={(block.items || []).slice(0, 4)}
            onUpload={(index, file) => onImageUpload(block.id, index, file)}
            onRemove={(index) => onImageRemove(block.id, index)}
            style={textStyle}
            columns={2}
          />
        );
      
      case 'CAROUSEL':
        return (
          <CarouselBlock
            blockId={block.id}
            items={block.items || []}
            style={textStyle}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            updateBlock={updateBlock}
          />
        );
      
      case 'IMAGE_TEXT_RIGHT':
      case 'IMAGE_TEXT_LEFT':
        return (
          <ImageTextBlock
            blockId={block.id}
            content={block.content || ''}
            imageUrl={getImageUrl(0)}
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
            content={block.content || ''}
            items={block.items || []}
            updateBlock={updateBlock}
            style={textStyle}
          />
        );
      
      case 'LAYOUT_TEXT_IMG_TEXT':
        return (
          <LayoutTextImgTextBlock
            blockId={block.id}
            content={block.content || ''}
            imageUrl={getImageUrl(0)}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            updateBlock={updateBlock}
            style={textStyle}
          />
        );
      
      case 'PHOTO':
        return (
          <PhotoBlock
            blockId={block.id}
            imageUrl={getImageUrl(0)}
            onUpload={(file: File) => onImageUpload(block.id, 0, file)}
            onRemove={() => onImageRemove(block.id, 0)}
            updateBlock={updateBlock}
            style={textStyle}
          />
        );
      
      case 'SLIDER':
        return (
          <SliderBlock
            blockId={block.id}
            items={block.items || []}
            style={textStyle}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            updateBlock={updateBlock}
          />
        );
      
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };
  
  return (
    <div className={styles.blockPreviewWrapper}>
      <div className={styles.controls}>
        <button onClick={() => moveBlock(block.id, 'up')}
                className={styles.controlButton}>↑
        </button>
        <button onClick={() => moveBlock(block.id, 'down')}
                className={styles.controlButton}>↓
        </button>
        <button onClick={() => removeBlock(block.id)}
                className={styles.controlButton}>✕
        </button>
      </div>
      {renderBlockContent()}
    </div>
  );
};

export default BlockPreview;
