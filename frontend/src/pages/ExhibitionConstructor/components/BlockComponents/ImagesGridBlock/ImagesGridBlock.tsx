// components/BlockComponents/ImagesGridBlock.tsx
import React from 'react';
import ImageBlock from '../ImageBlock/ImageBlock.tsx';
import styles from './ImagesGridBlock.module.scss';
import { BlockItem } from '../../../types';

interface ImagesGridBlockProps {
  images: BlockItem[];
  onUpload: (index: number, file: File) => void;
  onRemove: (index: number) => void;
  style?: React.CSSProperties;
  columns?: number;
}

const ImagesGridBlock: React.FC<ImagesGridBlockProps> = ({
                                                           images,
                                                           onUpload,
                                                           onRemove,
                                                           style,
                                                           columns = 2
                                                         }) => {
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` } as React.CSSProperties}
    >
      {images.map((image, index) => (
        <div key={image.id || index} className={styles.gridItem}>
          <ImageBlock
            imageUrl={image.image_url}
            onUpload={(file: File) => onUpload(index, file)}
            onRemove={() => onRemove(index)}
            style={style}
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesGridBlock;
