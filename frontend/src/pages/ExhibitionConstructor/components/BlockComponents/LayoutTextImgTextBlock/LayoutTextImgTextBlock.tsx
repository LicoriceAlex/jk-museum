import React from 'react';
import styles from './LayoutTextImgTextBlock.module.scss';

import TextBlock from '../TextBlock/TextBlock';
import ImageBlock from '../ImageBlock/ImageBlock';

import { ExhibitionBlock } from '../../../types';

interface LayoutTextImgTextBlockProps {
  blockId: string;

  // два текста
  leftText: string;
  rightText: string;

  // одно фото по центру
  imageUrl?: string;

  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;

  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  style?: React.CSSProperties;
}

const LayoutTextImgTextBlock: React.FC<LayoutTextImgTextBlockProps> = ({
  blockId,
  leftText,
  rightText,
  imageUrl,
  onImageUpload,
  onImageRemove,
  updateBlock,
  style,
}) => {
  const updateSettings = (patch: Partial<ExhibitionBlock['settings']>) => {
    updateBlock(blockId, {
      settings: {
        ...(patch as any),
      },
    });
  };

  const handleLeftTextChange = (value: string) => {
    updateBlock(blockId, {
      settings: {
        text_left_html: value,
        text_right_html: rightText,
      },
    });
  };

  const handleRightTextChange = (value: string) => {
    updateBlock(blockId, {
      settings: {
        text_left_html: leftText,
        text_right_html: value,
      },
    });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.textLeft}>
        <TextBlock
          initialContent={leftText || ''}
          onContentChange={handleLeftTextChange}
          style={style}
          placeholder="Введите текст..."
        />
      </div>

      <div className={styles.imageCenter}>
        <ImageBlock
          imageUrl={imageUrl}
          onUpload={(file: File) => onImageUpload(blockId, 0, file)}
          onRemove={() => onImageRemove(blockId, 0)}
        />
      </div>

      <div className={styles.textRight}>
        <TextBlock
          initialContent={rightText || ''}
          onContentChange={handleRightTextChange}
          style={style}
          placeholder="Введите текст..."
        />
      </div>
    </div>
  );
};

export default LayoutTextImgTextBlock;
