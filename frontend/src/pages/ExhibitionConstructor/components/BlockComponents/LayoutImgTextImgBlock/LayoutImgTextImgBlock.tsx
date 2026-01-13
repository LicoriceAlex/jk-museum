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
  readOnly?: boolean;
}

const LayoutImgTextImgBlock: React.FC<Props> = ({
  blockId,
  items,
  content,
  style,
  updateBlock,
  onImageUpload,
  onImageRemove,
  readOnly = false,
}) => {
  const leftUrl = items?.[0]?.image_url;
  const rightUrl = items?.[1]?.image_url;

  return (
    <div className={styles.wrap}>
      <div className={styles.cell}>
        <ImageBlock
          imageUrl={leftUrl}
          onUpload={readOnly ? undefined : (file) => onImageUpload(blockId, 0, file)}
          onRemove={readOnly ? undefined : () => onImageRemove(blockId, 0)}
          containerStyle={{ height: '14.58vw' }}
          imageStyle={{ height: '100%', objectFit: 'contain' }}
          readOnly={readOnly}
        />
      </div>

      <div className={`${styles.cell} ${styles.textCell}`}>
        <TextBlock
          initialContent={content}
          content={content}
          onContentChange={readOnly ? undefined : (newContent) => updateBlock(blockId, { content: newContent })}
          style={style}
          placeholder="Нажмите, чтобы добавить описание"
          readOnly={readOnly}
        />
      </div>

      <div className={styles.cell}>
        <ImageBlock
          imageUrl={rightUrl}
          onUpload={readOnly ? undefined : (file) => onImageUpload(blockId, 1, file)}
          onRemove={readOnly ? undefined : () => onImageRemove(blockId, 1)}
          containerStyle={{ height: '14.58vw' }}
          imageStyle={{ height: '100%', objectFit: 'contain' }}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default LayoutImgTextImgBlock;
