// components/BlockComponents/ImageUploadBlock.tsx
import React, { useState } from 'react';
import styles from './ImageUploadBlock.module.scss';

interface ImageUploadBlockProps {
  onUpload: (file: File) => void;
  style?: React.CSSProperties;
  compactMode?: boolean;
}

const ImageUploadBlock: React.FC<ImageUploadBlockProps> = ({
                                                             onUpload,
                                                             compactMode = false
                                                           }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePreview = () => {
    setPreview(null);
  };
  
  return (
    <div className={`${styles.block} ${compactMode ? styles.compact : ''}`}>
      <div className={styles.uploadArea}>
        {preview ? (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            {!compactMode && (
              <button
                className={styles.removePreview}
                onClick={handleRemovePreview}
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="image-upload" className={styles.uploadLabel}>
              {compactMode ? 'Заменить' : 'Загрузите изображение'}
            </label>
          </>
        )}
      </div>
      
    </div>
  );
};

export default ImageUploadBlock;
