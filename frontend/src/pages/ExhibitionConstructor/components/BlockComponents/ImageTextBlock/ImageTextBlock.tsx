// components/Blocks/ImageTextBlock.tsx
import React from 'react';
import styles from './ImageTextBlock.module.scss';
import {ExhibitionBlock} from '../../../types.ts';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import TextBlock from '../TextBlock/TextBlock.tsx';

interface ImageTextBlockProps {
  blockId: string;
  content: string;
  imageUrl?: string;
  imagePosition: 'left' | 'right';
  style?: React.CSSProperties;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
}

const ImageTextBlock: React.FC<ImageTextBlockProps> = ({
                                                         blockId, content, imageUrl, imagePosition, style,
                                                         onImageUpload, onImageRemove, updateBlock
                                                       }) => {
  const handleTextChange = (newContent: string) => {
    updateBlock(blockId, { content: newContent });
  };
  
  return (
    <div className={styles.imageTextBlock}>
      {imagePosition === 'left' && (
        <div className={styles.imageContainer}>
          <ImageBlock
            imageUrl={imageUrl}
            onUpload={(file) => onImageUpload(blockId, 0, file)}
            onRemove={() => onImageRemove(blockId, 0)}
          />
        </div>
      )}
      <div className={styles.textContainer}>
        <TextBlock
          initialContent={content}
          onContentChange={handleTextChange}
          style={style}
          placeholder="Нажмите, чтобы добавить текст"
        />
      </div>
      {imagePosition === 'right' && (
        <div className={styles.imageContainer}>
          <ImageBlock
            imageUrl={imageUrl}
            onUpload={(file) => onImageUpload(blockId, 0, file)}
            onRemove={() => onImageRemove(blockId, 0)}
          />
        </div>
      )}
    </div>
  );
};

export default ImageTextBlock;
