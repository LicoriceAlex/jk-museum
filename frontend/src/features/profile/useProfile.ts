import { useState, useEffect } from "react";
import { buildProfileHandlers, type UserProfile } from "../../layouts/AuthLayout/function.ts";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getFileUrl,
  type UserProfileResponse,
} from "./profileService.ts";

// Дефолтные значения для новых пользователей
const DEFAULT_PROFILE: UserProfile = {
  name: "Иванов Иван Иванович",
  about: "Привет! Меня зовут Иван, я изучаю Узбекистанское изобразительное искусство, увлекающий историк, искусством и народными технологиями.",
  email: "ivanov.ivan@gmail.com",
};

export const useProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  // Загрузка профиля с сервера
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await fetchUserProfile();
        
        // Преобразуем данные с сервера в формат UserProfile
        const fullName = `${userData.surname || ""} ${userData.name || ""} ${userData.patronymic || ""}`.trim() || userData.name || "";
        const avatarUrl = userData.profile_image_key
          ? getFileUrl(userData.profile_image_key)
          : undefined;

        // Используем данные с сервера, если они есть, иначе дефолтные значения
        const profileData: UserProfile = {
          name: fullName || userData.email || DEFAULT_PROFILE.name,
          about: userData.about_me || DEFAULT_PROFILE.about,
          email: userData.email || DEFAULT_PROFILE.email,
          avatar: avatarUrl,
        };

        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
        setError(err instanceof Error ? err.message : "Не удалось загрузить профиль");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

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
    onSave: async (profileData: UserProfile) => {
      try {
        setIsSaving(true);
        setError(null);
        
        // Разбиваем полное имя на части (если нужно)
        const nameParts = profileData.name.trim().split(/\s+/);
        const surname = nameParts[0] || "";
        const name = nameParts[1] || nameParts[0] || "";
        const patronymic = nameParts.slice(2).join(" ") || "";

        // Подготавливаем данные для обновления
        const updateData: {
          name?: string;
          surname?: string;
          patronymic?: string;
          about_me?: string;
          profile_image_key?: string;
          email?: string;
        } = {
          name,
          surname,
          patronymic,
          about_me: profileData.about || null,
          email: profileData.email,
        };

        // Обрабатываем аватар
        if (profileData.avatar) {
          if (profileData.avatar.includes("/api/v1/files/")) {
            // Если это URL файла, извлекаем object_key
            const match = profileData.avatar.match(/\/api\/v1\/files\/([^/?]+)/);
            if (match) {
              updateData.profile_image_key = match[1];
            }
          } else if (profileData.avatar.startsWith("data:")) {
            // Если это data URL (новый файл), загружаем его
            const response = await fetch(profileData.avatar);
            const blob = await response.blob();
            const file = new File([blob], "avatar.jpg", { type: blob.type });
            
            const uploadResult = await uploadProfileImage(file);
            updateData.profile_image_key = uploadResult.object_key;
          }
        }
        // Если аватар не указан, не передаем profile_image_key (останется прежним)

        // Отправляем обновление на сервер
        const updatedUser = await updateUserProfile(updateData);

        // Обновляем локальное состояние с данными с сервера
        const fullName = `${updatedUser.surname || ""} ${updatedUser.name || ""} ${updatedUser.patronymic || ""}`.trim() || updatedUser.name || "";
        const avatarUrl = updatedUser.profile_image_key
          ? getFileUrl(updatedUser.profile_image_key)
          : undefined;

        const updatedProfile: UserProfile = {
          name: fullName || updatedUser.email,
          about: updatedUser.about_me || "",
          email: updatedUser.email,
          avatar: avatarUrl,
        };

        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
      } catch (err) {
        console.error("Ошибка сохранения профиля:", err);
        const errorMessage = err instanceof Error ? err.message : "Не удалось сохранить профиль";
        setError(errorMessage);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    onAvatarChange: async (file: File) => {
      try {
        const uploadResult = await uploadProfileImage(file);
        const avatarUrl = getFileUrl(uploadResult.object_key);
        return avatarUrl;
      } catch (err) {
        console.error("Ошибка загрузки аватара:", err);
        throw err;
      }
    },
  });

  return {
    isEditing,
    profile,
    editedProfile,
    isLoading,
    isSaving,
    error,
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleAvatarChange,
  };
};
