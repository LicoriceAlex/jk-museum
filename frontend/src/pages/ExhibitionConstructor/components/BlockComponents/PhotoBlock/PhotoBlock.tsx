// PhotoBlock.tsx
import React from 'react';
import styles from './PhotoBlock.module.scss';
import {ExhibitionBlock} from '../../../types.ts';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import TextBlock from '../TextBlock/TextBlock.tsx';

// Add these props to its interface
interface PhotoBlockProps {
  blockId: string; // ADDED
  imageUrl?: string;
  onUpload: (file: File) => void; // This will likely be passed the specific item index
  onRemove: () => void; // This will likely be passed the specific item index
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void; // ADDED, if it has editable parts
  style?: React.CSSProperties;
  // If PhotoBlock has captions or other content:
  content?: string; // ADDED if PhotoBlock has editable text
}

const PhotoBlock: React.FC<PhotoBlockProps> = ({ blockId, imageUrl, onUpload, onRemove, updateBlock, style, content }) => {
  const handleCaptionChange = (newContent: string) => {
    updateBlock(blockId, { content: newContent });
  };
  
  return (
    <div className={styles.photoBlock}>
      <ImageBlock
        imageUrl={imageUrl}
        onUpload={(file) => onUpload(file)} // This onUpload should match PhotoBlock's own prop signature
        onRemove={onRemove} // This onRemove should match PhotoBlock's own prop signature
      />
      {/* If PhotoBlock has editable caption */}
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
