import React from 'react';
import styles from './LayoutImgTextImgBlock.module.scss';
import { BlockItem, ExhibitionBlock } from '../../../types';
import ImageBlock from '../ImageBlock/ImageBlock';
import TextBlock from '../TextBlock/TextBlock';

interface Props {
  blockId: string;
  items: BlockItem[];
  content: string;
  style?: React.CSSProperties;
  updateBlock: (blockId: string, updatedBlock: Partial<ExhibitionBlock>) => void;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
}

const LayoutImgTextImgBlock: React.FC<Props> = ({
  blockId,
  items,
  content,
  style,
  updateBlock,
  onImageUpload,
  onImageRemove,
}) => {
  const leftUrl = items?.[0]?.image_url;
  const rightUrl = items?.[1]?.image_url;

  return (
    <div className={styles.wrap}>
      <div className={styles.cell}>
        <ImageBlock
          imageUrl={leftUrl}
          onUpload={(file) => onImageUpload(blockId, 0, file)}
          onRemove={() => onImageRemove(blockId, 0)}
          containerStyle={{ height: 280 }}
          imageStyle={{ height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div className={`${styles.cell} ${styles.textCell}`}>
        <TextBlock
          initialContent={content}
          onContentChange={(newContent) => updateBlock(blockId, { content: newContent })}
          style={style}
          placeholder="Нажмите, чтобы добавить описание"
        />
      </div>

      <div className={styles.cell}>
        <ImageBlock
          imageUrl={rightUrl}
          onUpload={(file) => onImageUpload(blockId, 1, file)}
          onRemove={() => onImageRemove(blockId, 1)}
          containerStyle={{ height: 280 }}
          imageStyle={{ height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default LayoutImgTextImgBlock;
