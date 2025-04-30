import React, { useState } from 'react';
import styles from './CreateExhibitModal.module.scss';

interface CreateExhibitModalProps {
  onClose: () => void;
  onSave: (exhibit: any) => void;
}

interface FormData {
  title: string;
  author: string;
  creation_date: string;
  exhibit_type: string;
  short_description: string;
  description: string;
  image: File | null;
  imagePreviewUrl: string | null;
}

const CreateExhibitModal: React.FC<CreateExhibitModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: 'Неизвестен',
    creation_date: '',
    exhibit_type: '',
    short_description: '',
    description: '',
    image: null,
    imagePreviewUrl: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any previous errors when user makes changes
    if (error) setError(null);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: imageFile,
        imagePreviewUrl: URL.createObjectURL(imageFile),
      }));
      
      // Clear any previous errors when user makes changes
      if (error) setError(null);
    } else {
      setFormData(prev => ({ ...prev, image: null, imagePreviewUrl: null }));
    }
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Send POST request to the file upload endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить изображение');
      }
      
      // Parse the response to get the object_key
      const data = await response.json();
      return data.object_key; // We need to return the object_key for the exhibit
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Не удалось загрузить изображение');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form
      if (!formData.title) {
        throw new Error('Название экспоната обязательно для заполнения');
      }
      
      // Use the date value directly (it will be in YYYY-MM-DD format from the date input)
      const formattedDate = formData.creation_date || '';
      
      // Upload image if available
      let imageKey = ''; // Default empty value
      if (formData.image) {
        try {
          imageKey = await uploadImage(formData.image);
        } catch (uploadError) {
          throw new Error(`Ошибка загрузки изображения: ${uploadError}`);
        }
      }
      
      // Prepare data for API
      const exhibitData = {
        title: formData.title,
        author: formData.author || 'Неизвестен',
        creation_date: formattedDate,
        description: formData.description || formData.short_description || '', // Use short_description as fallback
        exhibit_type: formData.exhibit_type || 'другое',
        image_key: imageKey,
        organization_id: "6e377c56-45fd-4c7f-a127-00cd6877e172" // This should be dynamic in a real app
      };
      
      console.log('Sending exhibit data to API:', exhibitData);
      
      // Send to API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/exhibits/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(exhibitData),
      });
      
      if (!response.ok) {
        let errorMessage = 'Не удалось создать экспонат';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse the error JSON, use the default message
        }
        throw new Error(errorMessage);
      }
      
      const savedExhibit = await response.json();
      
      // Call the onSave prop with the data from the API
      onSave(savedExhibit);
      
      // Close the modal
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Error submitting exhibit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
          <svg viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round"
               strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.imageUploadArea}>
            {formData.imagePreviewUrl ? (
              <div className={styles.imagePreviewContainer}>
                <img src={formData.imagePreviewUrl} alt="Превью изображения" className={styles.imagePreview} />
                <div className={styles.imageActions}>
                  <button
                    type="button"
                    className={styles.imageActionButton}
                    onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreviewUrl: null }))}
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                  <label htmlFor="image-upload-replace" className={styles.imageActionButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <input
                      id="image-upload-replace"
                      type="file"
                      accept="image/*"
                      className={styles.imageInput}
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label htmlFor="image-upload" className={styles.imageUploadLabel}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Добавить изображение
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className={styles.imageInput}
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                />
              </label>
            )}
          </div>
          
          <div className={styles.formContent}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Название экспоната</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Введите название"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Автор</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={styles.formInput}
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Дата создания</label>
              <input
                type="date"
                name="creation_date"
                value={formData.creation_date}
                onChange={handleChange}
                className={styles.formInput}
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Тип экспоната</label>
              <div className={styles.selectWrapper}>
                <select
                  name="exhibit_type"
                  value={formData.exhibit_type}
                  onChange={handleChange}
                  className={styles.formSelect}
                  disabled={isSubmitting}
                >
                  <option value="" disabled>Выберите</option>
                  <option value="картина">картина</option>
                  <option value="скульптура">скульптура</option>
                  <option value="другое">другое</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Экспликация</label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Добавьте короткое описание"
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Добавьте полное описание"
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.submitButtonWrapper}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExhibitModal;
