import React from 'react';
import styles from './ExhibitModal.module.scss';
import { useExhibitModal } from '../../../../features/exhibits/useExhibitModal';
import {ExhibitModalProps, EditExhibitModalProps} from '../../../../features/exhibits/types';

const ExhibitModal: React.FC<ExhibitModalProps> = ({ exhibit, onClose, onUpdate, onDelete }) => {
  const {
    isEditModalOpen,
    isSubmitting,
    error,
    formData,
    handleOpenEditModal,
    handleCloseEditModal,
    handleChange,
    handleImageUpload,
    handleSubmit,
  } = useExhibitModal(exhibit, onClose, onUpdate);
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round"
               strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        
        <div className={styles.imageWrapper}>
          {/* Expand button in top-left corner */}
          <button className={styles.expandButton} onClick={() => {}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                 strokeLinejoin="round">
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          
          <img src={`${import.meta.env.VITE_API_URL}/api/v1/files/${exhibit.image_key}`} alt={exhibit.title}
               className={styles.imageTop}/>
        </div>
        
        <div className={styles.content}>
          <div className={styles.contentScrollable}>
            {exhibit.title && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Название экспоната</h3>
                <p className={styles.sectionContent}>{exhibit.title}</p>
              </div>
            )}
            
            {exhibit.author && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Автор</h3>
                <p className={styles.sectionContent}>{exhibit.author}</p>
              </div>
            )}
            
            {exhibit.creation_date && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Дата создания</h3>
                <p className={styles.sectionContent}>{exhibit.creation_date}</p>
              </div>
            )}
            
            {exhibit.exhibit_type && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Тип экспоната</h3>
                <p className={styles.sectionContent}>{exhibit.exhibit_type}</p>
              </div>
            )}
            
            {exhibit.description && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Описание экспоната</h3>
                <p className={styles.sectionContent}>{exhibit.description}</p>
              </div>
            )}
          </div>
          
          <div className={styles.editButtonWrapper}>
            <button className={styles.editButton} onClick={handleOpenEditModal}>Редактировать</button>
            {onDelete && (
              <button 
                className={styles.deleteButton} 
                onClick={() => {
                  if (window.confirm('Вы уверены, что хотите удалить этот экспонат?')) {
                    onDelete(exhibit.id);
                  }
                }}
              >
                Удалить
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditExhibitModal
          exhibit={exhibit}
          onClose={handleCloseEditModal}
          formData={formData}
          isSubmitting={isSubmitting}
          error={error}
          handleChange={handleChange}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const EditExhibitModal: React.FC<EditExhibitModalProps> = ({
                                                             onClose,
                                                             formData,
                                                             isSubmitting,
                                                             error,
                                                             handleChange,
                                                             handleImageUpload,
                                                             handleSubmit,
                                                           }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
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
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className={styles.imageUploadArea}>
            <label htmlFor="image-upload" className={styles.imageWrapper}>
              {formData.imagePreviewUrl && (
                <>
                  <img
                    src={formData.imagePreviewUrl}
                    alt="Превью изображения"
                    className={styles.imageTop}
                  />
                  <div className={styles.changeImageOverlay}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round">
                      <path
                        d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <span>Изменить изображение</span>
                  </div>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className={styles.imageInput}
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
            </label>
          </div>
          
          <div className={styles.formContent}>
            <div className={styles.formGroup}>
              <label className={styles.sectionTitle}>Название экспоната</label>
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
              <label className={styles.sectionTitle}>Автор</label>
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
              <label className={styles.sectionTitle}>Дата создания</label>
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
              <label className={styles.sectionTitle}>Тип экспоната</label>
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
              <label className={styles.sectionTitle}>Экспликация</label>
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
              <label className={styles.sectionTitle}>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Добавьте полное описание"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className={styles.submitButtonWrapper}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Обновление...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExhibitModal;
