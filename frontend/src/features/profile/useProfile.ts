import { useState } from 'react';

export interface UserProfile {
  name: string;
  about: string;
  email: string;
  avatar?: string;
}

export const useProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Иванов Иван Иванович',
    about: 'Привет! Меня зовут Иван, я изучаю Узбекистанское изобразительное искусство, увлекающий историк, искусством и народными технологиями.',
    email: 'ivanov.ivan@example.ru'
  });
  
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };
  
  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  
  const handleBack = () => {
    if (isEditing) {
      handleCancel();
    }
  };
  
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  return {
    isEditing,
    profile,
    editedProfile,
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleAvatarChange
  };
};
