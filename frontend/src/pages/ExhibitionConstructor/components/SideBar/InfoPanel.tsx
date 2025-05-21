// components/InfoPanel/InfoPanel.tsx
import React from 'react';
import { ExhibitionData } from '../../types'; // Убедитесь, что 'cover' теперь строка в ExhibitionData

import styles from './InfoPanel.module.scss'; // Import the CSS module

const MOCK_EXHIBITION_CATEGORIES = [
  'Искусство',
  'История',
  'Наука',
  'Технологии',
  'Природа',
  'Культура',
  'Дизайн',
  'Фотография',
  'Современное искусство',
  'Археология',
  'Этнография',
  'Геология',
  'Астрономия',
  'Биология',
  'Литература',
  'Архитектура',
  'Мода',
  'Кино',
  'Музыка',
  'Интерактив'
];

interface InfoPanelProps {
  exhibitionData: ExhibitionData;
  updateExhibitionData: (data: Partial<ExhibitionData>) => void;
  onCoverImageUpload: (file: File) => void; // Добавляем этот пропс
}

const InfoPanel: React.FC<InfoPanelProps> = ({ exhibitionData, updateExhibitionData }) => {
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;
    if (newTag && !exhibitionData.tags?.includes(newTag)) {
      updateExhibitionData({
        tags: [...(exhibitionData.tags || []), newTag]
      });
    }
    e.target.value = "";
  };
  
  const handleTagRemove = (index: number) => {
    updateExhibitionData({
      tags: exhibitionData.tags?.filter((_, i) => i !== index) || []
    });
  };
  
  const handleCoverUploadClick = () => {
    document.getElementById('coverFileInput')?.click();
  };
  
  // ЛОГИКА ЗАГРУЗКИ ИЗОБРАЖЕНИЯ ПЕРЕНЕСЕНА СЮДА
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Selected file in InfoPanel:', file); // Логгируем выбранный файл
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        console.log('FileReader result (Data URL) in InfoPanel:', imageDataUrl); // Логгируем результат FileReader
        updateExhibitionData({ cover: imageDataUrl }); // Обновляем данные обложки
      };
      reader.onerror = (error) => {
        console.error('FileReader error in InfoPanel:', error); // Логгируем ошибки FileReader
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div
      className={styles.infoPanel}>
      <div className={styles.formGroup}>
        <label htmlFor="exhibitionTitle" className={styles.label}>Название
          выставки</label>
        <input
          id="exhibitionTitle"
          type="text"
          className={styles.input}
          value={exhibitionData.title || ''} // Убедитесь, что значение не null/undefined
          onChange={(e) => updateExhibitionData({title: e.target.value})}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="exhibitionDescription"
               className={styles.label}>Описание</label>
        <textarea
          id="exhibitionDescription"
          className={styles.input}
          value={exhibitionData.description || ''}
          onChange={(e) => updateExhibitionData({description: e.target.value})}
        />
      </div>
      
      {/* Добавляем поле для организации */}
      <div className={styles.formGroup}>
        <label htmlFor="exhibitionOrganization" className={styles.label}>Музейная организация</label>
        <input
          id="exhibitionOrganization"
          type="text"
          className={styles.input}
          value={exhibitionData.organization || ''}
          onChange={(e) => updateExhibitionData({ organization: e.target.value })}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="exhibitionTeam" className={styles.label}>Команда</label>
        <input
          id="exhibitionTeam"
          className={styles.input}
          value={exhibitionData.team || ''}
          onChange={(e) => updateExhibitionData({team: e.target.value})}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="exhibitionCategories"
               className={styles.label}>Теги</label>
        <div
          className={styles.selectWrapper}>
          <select
            id="exhibitionCategories"
            className={styles.selectInput}
            value=""
            onChange={handleTagChange}
          >
            <option value="" disabled hidden>Выберите тег</option> {/* Добавлен текст плейсхолдера */}
            {MOCK_EXHIBITION_CATEGORIES.map((category, index) => (
              <option
                key={index}
                value={category}
                disabled={exhibitionData.tags?.includes(category)}
              >
                {category}
              </option>
            ))}
          </select>
          <svg className={styles.selectArrow} fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        <div className={styles.tagsList}>
          {exhibitionData.tags?.map((tag, index) => (
            <div key={index} className={styles.tag}>
              {tag}
              <button
                type="button"
                className={styles.tagRemoveButton}
                onClick={() => handleTagRemove(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Обложка</label>
        <div
          className={styles.coverUploadArea} onClick={handleCoverUploadClick}> {/* Добавили onClick сюда */}
          {exhibitionData.cover ? (
            <img src={exhibitionData.cover} alt="Обложка"
                 className={styles.coverImage}/>
          ) : (
            <div className={styles.coverPlaceholder}>
              <svg className={styles.coverIcon} fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {/* Кнопка "Загрузить обложку" теперь просто текст, так как клик по всей области */}
              <span className={styles.uploadButton}>Загрузить обложку</span>
            </div>
          )}
          <input
            id="coverFileInput"
            type="file"
            style={{display: 'none'}}
            onChange={handleCoverFileChange}
            accept="image/*"
          />
        </div>
      </div>
      
      <button
        type="button"
        className={styles.saveButton}
      >
        Сохранить
      </button>
    </div>
  );
};

export default InfoPanel;
