import React, { useId, useState } from 'react';
import styles from './ImageUploadBlock.module.scss';

interface ImageUploadBlockProps {
  onUpload: (file: File) => void;
  previewImage?: string;
}

const ImageUploadBlock: React.FC<ImageUploadBlockProps> = ({ onUpload, previewImage }) => {
  const [preview, setPreview] = useState<string | null>(previewImage || null);
  const inputId = useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onUpload(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.uploadArea}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
        id={inputId}
      />

      {preview ? (
        <img src={preview} alt="Preview" className={styles.previewImage} />
      ) : (
        <label htmlFor={inputId} className={styles.uploadLabel}>
          Загрузите изображение
        </label>
      )}
    </div>
  );
};

export default ImageUploadBlock;
