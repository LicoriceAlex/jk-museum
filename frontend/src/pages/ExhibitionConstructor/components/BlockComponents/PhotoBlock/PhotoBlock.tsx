// PhotoBlock.tsx
import React from 'react';
import styles from './PhotoBlock.module.scss';
import {ExhibitionBlock} from '../../../types.ts';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import TextBlock from '../TextBlock/TextBlock.tsx';

interface PhotoBlockProps {
  blockId: string;
  imageUrl?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  style?: React.CSSProperties;
  content?: string;
}

const PhotoBlock: React.FC<PhotoBlockProps> = ({ blockId, imageUrl, onUpload, onRemove, updateBlock, style, content }) => {
  const handleCaptionChange = (newContent: string) => {
    updateBlock(blockId, { content: newContent });
  };
  
  return (
    <div className={styles.photoBlock}>
      <ImageBlock
        imageUrl={imageUrl}
        onUpload={(file) => onUpload(file)}
        onRemove={onRemove}
      />
      {content !== undefined && (
        <TextBlock
          initialContent={content}
          onContentChange={handleCaptionChange}
          style={{...style, fontSize: '0.9em', textAlign: 'center'}}
          placeholder="Добавить подпись"
        />
      )}
    </div>
  );
};

export default PhotoBlock;
