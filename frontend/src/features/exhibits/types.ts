// Типы данных для работы с экспонатами
import { ChangeEvent, FormEvent } from 'react';

export interface Exhibit {
  id: string;
  title: string;
  image_key: string;
  author?: string;
  creation_date?: string;
  exhibit_type?: string;
  description?: string;
}

// Переименовали FormData в ExhibitFormData, чтобы избежать конфликта
export interface ExhibitFormData {
  title: string;
  author: string;
  creation_date: string;
  exhibit_type: string;
  short_description: string;
  description: string;
  image: File | null;
  imagePreviewUrl: string | null;
}

export interface ExhibitModalProps {
  exhibit: Exhibit;
  onClose: () => void;
  onUpdate?: (updatedExhibit: Exhibit) => void;
}

export interface EditExhibitModalProps {
  exhibit: Exhibit;
  onClose: () => void;
  isSubmitting: boolean;
  error: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  formData: ExhibitFormData; // Добавили formData в основной интерфейс
}
