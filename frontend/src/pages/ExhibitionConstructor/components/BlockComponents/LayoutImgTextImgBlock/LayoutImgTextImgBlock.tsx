// components/BlockComponents/LayoutImgTextImgImgBlock.tsx
import React from 'react';
import ImageBlock from '../ImageBlock/ImageBlock'; // Assuming path to your ImageBlock
import TextBlock from '../TextBlock/TextBlock'; // Path to the new EditableText component
import styles from './LayoutImgTextImgBlock.module.scss';
import {ExhibitionBlock} from '../../../types.ts';

interface LayoutImgTextImgBlockProps {
  // block.items will contain objects like { image_url?: string }
  // block.content will contain the text
  blockId: string; // Needed for onImageUpload/onImageRemove and updateBlock
  content: string;
  leftImageUrl?: string;  // Now optional as ImageBlock handles initial state
  rightImageUrl?: string; // Now optional
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void; // Add updateBlock
  style?: React.CSSProperties; // Style for the text content
}

const LayoutImgTextImgBlock: React.FC<LayoutImgTextImgBlockProps> = ({
                                                                       blockId,
                                                                       content,
                                                                       leftImageUrl,
                                                                       rightImageUrl,
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
        <div className={styles.imageWrapper}> {/* Using imageWrapper for consistent styling */}
          <ImageBlock
            imageUrl={leftImageUrl}
            onUpload={(file: File) => onImageUpload(blockId, 0, file)} // Left image is item 0
            onRemove={() => onImageRemove(blockId, 0)}
          />
        </div>
        
        <div className={styles.contentWrapper}>
          <TextBlock
            initialContent={content}
            onContentChange={handleTextChange}
            style={style}
            placeholder="Нажмите, чтобы добавить описание"
          />
        </div>
        
        <div className={styles.imageWrapper}> {/* Using imageWrapper for consistent styling */}
          <ImageBlock
            imageUrl={rightImageUrl}
            onUpload={(file: File) => onImageUpload(blockId, 1, file)} // Right image is item 1
            onRemove={() => onImageRemove(blockId, 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutImgTextImgBlock;
