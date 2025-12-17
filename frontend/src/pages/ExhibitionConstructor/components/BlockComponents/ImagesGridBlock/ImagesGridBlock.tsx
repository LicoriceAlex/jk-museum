import React from 'react';
import styles from './ImagesGridBlock.module.scss';
import { BlockItem } from '../../../types';
import ImageBlock from '../ImageBlock/ImageBlock';

interface ImagesGridBlockProps {
  blockId: string;
  items: BlockItem[];
  columns: number;
  onImageUpload: (blockId: string, itemIndex: number, file: File) => void;
  onImageRemove: (blockId: string, itemIndex: number) => void;
}

const ImagesGridBlock: React.FC<ImagesGridBlockProps> = ({
  blockId,
  items,
  columns,
  onImageUpload,
  onImageRemove,
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
            onUpload={(file) => onImageUpload(blockId, index, file)}
            onRemove={() => onImageRemove(blockId, index)}
            containerStyle={{ height: 280 }}
            imageStyle={{ height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesGridBlock;
