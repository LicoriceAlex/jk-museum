import React from 'react';
import styles from './ImageBlock.module.scss';
import ImageUploadBlock from '../ImageUploadBlock/ImageUploadBlock';

interface ImageBlockProps {
  imageUrl?: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  readOnly?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  imageUrl,
  onUpload,
  onRemove,
  style,
  containerStyle,
  imageStyle,
  readOnly = false,
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
          {!readOnly && onRemove && (
            <button className={styles.removeButton} onClick={onRemove}>
              ×
            </button>
          )}
        </div>
      ) : (
        !readOnly && onUpload && (
          <div className={styles.uploadContainer} style={{ height: '100%' }}>
            <ImageUploadBlock onUpload={onUpload} />
          </div>
        )
      )}
    </div>
  );
};

export default ImageBlock;
