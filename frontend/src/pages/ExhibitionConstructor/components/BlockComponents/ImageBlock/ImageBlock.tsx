import React from 'react';
import styles from './ImageBlock.module.scss';
import ImageUploadBlock from '../ImageUploadBlock/ImageUploadBlock';

interface ImageBlockProps {
  imageUrl?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  imageUrl,
  onUpload,
  onRemove,
  style,
  containerStyle,
  imageStyle,
}) => {
  return (
    <div className={styles.imageBlock} style={{ ...style, ...containerStyle }}>
      {imageUrl ? (
        <div className={styles.imageContainer} style={{ height: '100%' }}>
          <img
            src={imageUrl}
            alt="Uploaded content"
            className={styles.image}
            style={imageStyle}
          />
          <button className={styles.removeButton} onClick={onRemove}>
            ×
          </button>
        </div>
      ) : (
        <div className={styles.uploadContainer} style={{ height: '100%' }}>
          <ImageUploadBlock onUpload={onUpload} />
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
