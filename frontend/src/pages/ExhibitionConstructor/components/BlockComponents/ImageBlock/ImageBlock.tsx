import React from 'react';
import styles from './ImageBlock.module.scss';
import ImageUploadBlock from '../ImageUploadBlock/ImageUploadBlock';

interface ImageBlockProps {
  imageUrl?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  style?: React.CSSProperties;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
                                                 imageUrl,
                                                 onUpload,
                                                 onRemove,
                                                 style
                                               }) => {
  console.log('ImageBlock received imageUrl:', imageUrl);
  
  return (
    <div className={styles.imageBlock} style={style}>
      {imageUrl ? (
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt="Uploaded content" className={styles.image} />
          <div className={styles.actions}>
            <button
              className={styles.removeButton}
              onClick={onRemove}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.uploadContainer}>
          <ImageUploadBlock
            onUpload={onUpload}
            style={style}
            compactMode={false}
          />
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
