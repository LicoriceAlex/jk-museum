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
  onDelete?: (exhibitId: string) => void;
}

export interface EditExhibitModalProps {
  exhibit: Exhibit;
  onClose: () => void;
  isSubmitting: boolean;
  error: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  formData: ExhibitFormData;
}
