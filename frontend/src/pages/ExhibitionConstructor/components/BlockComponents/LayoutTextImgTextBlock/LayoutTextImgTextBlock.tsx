import React from 'react';
import ImageBlock from '../ImageBlock/ImageBlock.tsx'; // Import ImageBlock for upload/remove functionality
import TextBlock from '../TextBlock/TextBlock.tsx'; // Import EditableText for in-place editing
import styles from './LayoutTextImgTextBlock.module.scss';
import { ExhibitionBlock } from '../../../types.ts';

interface LayoutTextImgTextBlockProps {
  blockId: string; // From BlockPreview
  content: string; // From BlockPreview (will represent the main text)
  imageUrl?: string; // Can be string or undefined now
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void; // From BlockPreview
  onImageRemove: (blockId: string, itemIndex: number) => void; // From BlockPreview
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void; // From BlockPreview
  style?: React.CSSProperties; // Style for the text
  // If you need two separate text fields (left and right), you would add them here:
  // leftTextContent?: string;
  // rightTextContent?: string;
}

const LayoutTextImgTextBlock: React.FC<LayoutTextImgTextBlockProps> = ({
                                                                         blockId,
                                                                         content,
                                                                         imageUrl,
                                                                         onImageUpload,
                                                                         onImageRemove,
                                                                         updateBlock,
                                                                         style,
                                                                         // If you added leftTextContent, rightTextContent, destructure them here
                                                                       }) => {
  const handleTextChange = (newContent: string) => {
    updateBlock(blockId, { content: newContent });
  };
  
  // If you need two text fields, you'd have separate handlers and content fields:
  // const handleLeftTextChange = (newContent: string) => { updateBlock(blockId, { leftTextContent: newContent }); };
  // const handleRightTextChange = (newContent: string) => { updateBlock(blockId, { rightTextContent: newContent }); };
  
  return (
    <div className={styles.block}>
      <div className={styles.layout}>
        {/* Left Text Content */}
        <div className={styles.textContent}>
          <TextBlock
            initialContent={content || ''} // Use content prop
            onContentChange={handleTextChange}
            style={style}
            placeholder="Нажмите, чтобы добавить текст..."
          />
          {/* If you have two text fields, render one here:
          <EditableText
            initialContent={leftTextContent || ''}
            onContentChange={handleLeftTextChange}
            style={style}
            placeholder="Левый текст..."
          />
          */}
        </div>
        
        {/* Image Block */}
        <div className={styles.imageContainer}>
          <ImageBlock
            imageUrl={imageUrl} // This can now be undefined
            onUpload={(file: File) => onImageUpload(blockId, 0, file)} // Image is item 0
            onRemove={() => onImageRemove(blockId, 0)}
          />
        </div>
        
        {/* Right Text Content (Optional, if you decide on a single main text field, this div might be styled differently or removed) */}
        <div className={styles.textContent}>
          {/* If you have two text fields, render the second one here:
            <EditableText
              initialContent={rightTextContent || ''}
              onContentChange={handleRightTextChange}
              style={style}
              placeholder="Правый текст..."
            />
            */}
          {/* If `content` is the only text field, this div might just contain styling or be removed.
                For a "Text-Image-Text" layout with one main text field, you might replicate the `EditableText`
                to visually fill both text columns, or adjust styling if `content` is intended for both.
                Based on `BlockPreview` passing `content` only, the current setup implies one main text field.
                Let's assume the passed `content` is the primary text. If you truly need
                two separate text fields, `ExhibitionBlock`'s structure and `BlockPreview`'s
                logic for `LAYOUT_TEXT_IMG_TEXT` would need to be updated to manage two content strings.
            */}
          {/* For now, this `textContent` div serves as a placeholder if you'd like to extend it later.
                If the layout is strictly `Text | Image | Text`, and `content` is one large block,
                you might need to adjust the flex grow/shrink or use `columns` CSS.
            */}
        </div>
      </div>
    </div>
  );
};

export default LayoutTextImgTextBlock;
