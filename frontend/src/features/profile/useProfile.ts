import { useState } from "react";
import { buildProfileHandlers, type UserProfile } from "../../layouts/AuthLayout/function.ts";

export const useProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "Иванов Иван Иванович",
    about:
      "Привет! Меня зовут Иван, я изучаю Узбекистанское изобразительное искусство, увлекающий историк, искусством и народными технологиями.",
    email: "ivanov.ivan@example.ru",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  // Подключаем вынесённые функции (фабрика обработчиков)
  const {
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleAvatarChange,
  } = buildProfileHandlers({
    isEditing,
    profile,
    editedProfile,
    setIsEditing,
    setProfile,
    setEditedProfile,
  });

  return {
    isEditing,
    profile,
    editedProfile,
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleAvatarChange,
  };
};
