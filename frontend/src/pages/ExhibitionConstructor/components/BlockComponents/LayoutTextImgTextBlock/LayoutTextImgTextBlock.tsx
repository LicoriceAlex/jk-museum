import React from 'react';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import TextBlock from '../TextBlock/TextBlock.tsx';
import styles from './LayoutTextImgTextBlock.module.scss';
import { ExhibitionBlock } from '../../../types.ts';

interface LayoutTextImgTextBlockProps {
  blockId: string;
  content: string;
  imageUrl?: string;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  style?: React.CSSProperties;
}

const LayoutTextImgTextBlock: React.FC<LayoutTextImgTextBlockProps> = ({
                                                                         blockId,
                                                                         content,
                                                                         imageUrl,
                                                                         onImageUpload,
                                                                         onImageRemove,
                                                                         updateBlock,
                                                                         style,
                                                                       }) => {
  const handleTextChange = (newContent: string) => {
    updateBlock(blockId, { content: newContent });
  };
  
  return (
    <div className={styles.block}>
      <div className={styles.layout}>
        <div className={styles.textContent}>
          <TextBlock
            initialContent={content || ''}
            onContentChange={handleTextChange}
            style={style}
            placeholder="Нажмите, чтобы добавить текст..."
          />
        </div>
        
        <div className={styles.imageContainer}>
          <ImageBlock
            imageUrl={imageUrl}
            onUpload={(file: File) => onImageUpload(blockId, 0, file)}
            onRemove={() => onImageRemove(blockId, 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutTextImgTextBlock;
