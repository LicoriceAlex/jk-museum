import React, { useMemo, useState } from 'react';
import styles from './CreateExhibitModal.module.scss';
import { getToken } from '../../../../utils/serviceToken';

interface CreateExhibitModalProps {
  onClose: () => void;
  onSave: (exhibit: any) => void;
}

interface FormData {
  title: string;
  author: string;
  creation_daymonth: string; // "dd.mm"
  creation_year: string;     // "yyyy" (или "")
  exhibit_type: string;
  short_description: string;
  description: string;
  image: File | null;
  imagePreviewUrl: string | null;
}

/** Маска + ограничение: ДД.ММ, день ≤ 31, месяц ≤ 12 */
function maskClampDayMonth(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  const ddRaw = digits.slice(0, 2);
  const mmRaw = digits.slice(2, 4);

  let dd = ddRaw;
  let mm = mmRaw;

  if (ddRaw.length === 2) {
    const d = Math.max(1, Math.min(31, Number(ddRaw) || 0));
    dd = String(d).padStart(2, '0');
  }
  if (mmRaw.length === 2) {
    const m = Math.max(1, Math.min(12, Number(mmRaw) || 0));
    mm = String(m).padStart(2, '0');
  }

  if (digits.length <= 2) return ddRaw;
  return `${dd}.${mmRaw.length ? mm : mmRaw}`;
}

function isValidDayMonth(dm: string): boolean {
  const m = /^(\d{2})\.(\d{2})$/.exec(dm);
  if (!m) return false;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  return d >= 1 && d <= 31 && mo >= 1 && mo <= 12;
}

function isValidYear(y: string): boolean {
  if (y === '') return true;
  if (!/^\d{1,4}$/.test(y)) return false;
  const num = Number(y);
  return num >= 0 && num <= 2025;
}

/** Собираем YYYY-MM-DD, если обе части валидны */
function composeISO(dm: string, y: string): string {
  if (!isValidDayMonth(dm) || !isValidYear(y) || y === '') return '';
  const [dd, mm] = dm.split('.');
  const yyyy = y.padStart(4, '0');
  const jsDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (
    jsDate.getFullYear() !== Number(yyyy) ||
    jsDate.getMonth() !== Number(mm) - 1 ||
    jsDate.getDate() !== Number(dd)
  ) return '';
  return `${yyyy}-${mm}-${dd}`;
}

const CreateExhibitModal: React.FC<CreateExhibitModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: 'Неизвестен',
    creation_daymonth: '',
    creation_year: '',
    exhibit_type: '',
    short_description: '',
    description: '',
    image: null,
    imagePreviewUrl: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const YEARS = useMemo(() => Array.from({ length: 2026 }, (_, i) => i), []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleDayMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskClampDayMonth(e.target.value);
    setFormData(prev => ({ ...prev, creation_daymonth: masked }));
    if (error) setError(null);
  };

  const handleYearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, creation_year: digits }));
    if (error) setError(null);
  };

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, creation_year: e.target.value }));
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
      if (error) setError(null);
    } else {
      setFormData(prev => ({ ...prev, image: null, imagePreviewUrl: null }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const token = getToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/files/upload`, {
      method: 'POST',
      headers,
      body: fd,
    });
    if (!response.ok) throw new Error('Не удалось загрузить изображение');
    const data = await response.json();
    return data.object_key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      if (!formData.title.trim()) throw new Error('Название экспоната обязательно для заполнения');
      if (formData.creation_daymonth && !isValidDayMonth(formData.creation_daymonth)) {
        throw new Error('Некорректная дата: проверьте день и месяц (ДД.ММ)');
      }
      if (formData.creation_year && !isValidYear(formData.creation_year)) {
        throw new Error('Некорректный год: допустимо от 0 до 2025');
      }

      const isoDate = composeISO(formData.creation_daymonth, formData.creation_year);

      let imageKey: string | undefined = undefined;
      if (formData.image) {
        imageKey = await uploadImage(formData.image);
      }

      const exhibitData: Record<string, any> = {
        title: formData.title.trim(),
        author: formData.author?.trim() || 'Неизвестен',
        description: formData.description || formData.short_description || '',
        exhibit_type: formData.exhibit_type || 'другое',
        // organization_id будет автоматически получен из текущего пользователя на бэкенде
      };

      // Добавляем creation_date только если дата валидна
      if (isoDate) {
        exhibitData.creation_date = isoDate;
      }

      // Добавляем image_key только если изображение загружено
      if (imageKey) {
        exhibitData.image_key = imageKey;
      }

      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/exhibits/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(exhibitData),
      });

      if (!response.ok) {
        let msg = 'Не удалось создать экспонат';
        try { msg = (await response.json()).message || msg; } catch {}
        throw new Error(msg);
      }

      const saved = await response.json();
      onSave(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.imageUploadArea}>
            {formData.imagePreviewUrl ? (
              <div className={styles.imagePreviewContainer}>
                <img src={formData.imagePreviewUrl} alt="Превью" className={styles.imagePreview} />
                <div className={styles.imageActions}>
                  <button
                    type="button"
                    className={styles.imageActionButton}
                    onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreviewUrl: null }))}
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                  <label htmlFor="image-upload-replace" className={styles.imageActionButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

              {/* слева: ДД.ММ; справа: год. Суффикс «г.» появляется только если год введён/выбран */}
              <div className={styles.dateField}>
                <input
                  type="text"
                  inputMode="numeric"
                  name="creation_daymonth"
                  value={formData.creation_daymonth}
                  onChange={handleDayMonthChange}
                  className={`${styles.formInput} ${styles.dateDM}`}
                  placeholder="Введите"
                  autoComplete="off"
                  disabled={isSubmitting}
                />

                <div className={`${styles.yearBox} ${formData.creation_year ? styles.hasYear : ''}`}>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="creation_year"
                    value={formData.creation_year}
                    onChange={handleYearInput}
                    className={`${styles.formInput} ${styles.yearInput}`}
                    autoComplete="off"
                    disabled={isSubmitting}
                  />

                  {/* overlay-select справа: кликается «пустая» зона + стрелка  */}
                  <select
                    className={styles.yearSelectOverlay}
                    value={formData.creation_year === '' ? '' : formData.creation_year}
                    onChange={handleYearSelect}
                    disabled={isSubmitting}
                    aria-label="Выбрать год"
                  >
                    <option value="" />
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  {/* стрелка */}
                  <svg className={styles.yearChevron} viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
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
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
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
