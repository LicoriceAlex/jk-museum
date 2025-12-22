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
  readOnly?: boolean;
}

const ImageTextBlock: React.FC<ImageTextBlockProps> = ({
                                                         blockId, content, imageUrl, imagePosition, style,
                                                         onImageUpload, onImageRemove, updateBlock, readOnly = false
                                                       }) => {
  const handleTextChange = (newContent: string) => {
    if (!readOnly) {
      updateBlock(blockId, { content: newContent });
    }
  };
  
  return (
    <div className={styles.imageTextBlock}>
      {imagePosition === 'left' && (
        <div className={styles.imageContainer}>
          <ImageBlock
            imageUrl={imageUrl}
            onUpload={readOnly ? undefined : (file) => onImageUpload(blockId, 0, file)}
            onRemove={readOnly ? undefined : () => onImageRemove(blockId, 0)}
            readOnly={readOnly}
          />
        </div>
      )}
      <div className={styles.textContainer}>
        <TextBlock
          initialContent={content}
          content={content}
          onContentChange={readOnly ? undefined : handleTextChange}
          style={style}
          placeholder="ВВЕДИТЕ ТЕКСТ"
          readOnly={readOnly}
        />
      </div>
      {imagePosition === 'right' && (
        <div className={styles.imageContainer}>
          <ImageBlock
            imageUrl={imageUrl}
            onUpload={readOnly ? undefined : (file) => onImageUpload(blockId, 0, file)}
            onRemove={readOnly ? undefined : () => onImageRemove(blockId, 0)}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
};

export default ImageTextBlock;
