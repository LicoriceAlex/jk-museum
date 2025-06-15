import { useState, ChangeEvent, FormEvent } from 'react';
import { Exhibit, ExhibitFormData } from './types';

export const useExhibitModal = (
  exhibit: Exhibit,
  onClose: () => void,
  onUpdate?: (updatedExhibit: Exhibit) => void
) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExhibitFormData>({
    title: exhibit.title || '',
    author: exhibit.author || 'Неизвестен',
    creation_date: exhibit.creation_date || '',
    exhibit_type: exhibit.exhibit_type || '',
    short_description: '',
    description: exhibit.description || '',
    image: null,
    imagePreviewUrl: exhibit.image_key ? `${import.meta.env.VITE_API_URL}/api/v1/files/${exhibit.image_key}` : null,
  });
  
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  const handleUpdateExhibit = (updatedExhibit: Exhibit) => {
    if (onUpdate) {
      onUpdate(updatedExhibit);
    }
    setIsEditModalOpen(false);

    onClose();
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (error) setError(null);
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/files/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.object_key;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      let imageKey = exhibit.image_key;
      if (formData.image) {
        imageKey = await uploadImage(formData.image);
      }

      const requestData = {
        title: formData.title,
        author: formData.author,
        creation_date: formData.creation_date,
        description: formData.description,
        exhibit_type: formData.exhibit_type,
        image_key: imageKey,
      };
      
      console.log('Sending data:', requestData);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/exhibits/${exhibit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      const updatedExhibit = await response.json();
      handleUpdateExhibit(updatedExhibit);
      
    } catch (err) {
      console.error('Error:', err);
      setError(String(err));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isEditModalOpen,
    isSubmitting,
    error,
    formData,
    handleOpenEditModal,
    handleCloseEditModal,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleUpdateExhibit
  };
};
