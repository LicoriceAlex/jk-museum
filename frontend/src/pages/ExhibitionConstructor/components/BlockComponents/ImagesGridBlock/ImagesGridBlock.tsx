import React from 'react';
import styles from './ImagesGridBlock.module.scss';
import { BlockItem } from '../../../types';
import ImageBlock from '../ImageBlock/ImageBlock';

interface ImagesGridBlockProps {
  blockId?: string;
  items: BlockItem[];
  columns: number;
  onImageUpload?: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove?: (blockId: string, itemIndex: number) => void;
  readOnly?: boolean;
}

const ImagesGridBlock: React.FC<ImagesGridBlockProps> = ({
  blockId = '',
  items,
  columns,
  onImageUpload,
  onImageRemove,
  readOnly = false,
}) => {
  return (
    <div
      className={styles.imageGridBlock}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, index) => (
        <div key={item.id} className={styles.cell}>
          <ImageBlock
            imageUrl={item.image_url}
            onUpload={readOnly ? undefined : (file) => onImageUpload?.(blockId, index, file)}
            onRemove={readOnly ? undefined : () => onImageRemove?.(blockId, index)}
            containerStyle={{ height: 280 }}
            imageStyle={{ height: '100%', objectFit: 'cover' }}
            readOnly={readOnly}
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesGridBlock;
