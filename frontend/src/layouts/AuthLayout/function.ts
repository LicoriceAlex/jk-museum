// function.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/services/authService.ts";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  patronymic: string;
  role: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }
    
    const result = await register({
      email,
      password,
      name: "Имя",
      surname: "Фамилия",
      patronymic: "Отчество",
      role: "user",
    });
    
    if (result?.error) {
      setError("Ошибка при регистрации");
    } else {
      navigate("/auth/login");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    error,
    setError,
    handleSubmit,
  };
};

//LoginForm.tsx
// Общие типы и хук для форм аутентификации
import { useState, type ChangeEvent, type FormEvent } from "react";

export type Credentials = { username: string; password: string };
export type SubmitResult = { error?: string } | undefined;
export type SubmitFn = (c: Credentials) => Promise<SubmitResult>;

/**
 * useLoginForm — универсальный хук управления состоянием и сабмитом формы логина.
 * На вход принимает функцию отправки (login) и коллбек при успешном входе.
 */
export function useLoginForm(submitFn: SubmitFn, onSuccess: () => void) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await submitFn({ username: email, password });

    if (result?.error) {
      setError("Неверный логин или пароль");
    } else {
      setError(null);
      onSuccess();
    }
  };

  return {
    // state
    email,
    password,
    error,

    // handlers
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
}
//ExhibitsPage.tsx
// Общий хук и типы для страницы экспонатов

import { useRef, useState } from "react";

export type ExhibitsListRef = {
  fetchExhibits: () => Promise<void>;
} | null;

/**
 * useExhibitsPage — инкапсулирует логику модалки создания и обновления списка.
 */
export function useExhibitsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const exhibitsListRef = useRef<ExhibitsListRef>(null);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveExhibit = (newExhibit: any) => {
    // Можно заменить на реальный трекинг/уведомление
    // eslint-disable-next-line no-console
    console.log("New exhibit saved:", newExhibit);

    if (exhibitsListRef.current) {
      exhibitsListRef.current.fetchExhibits();
    }
  };

  return {
    isCreateModalOpen,
    exhibitsListRef,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleSaveExhibit,
  };
}

//useProfile.ts
// Вынесенные утилиты и фабрика обработчиков для профиля

import type React from "react";
import type { Dispatch, SetStateAction } from "react";

/** Тип данных профиля пользователя */
export interface UserProfile {
  name: string;
  about: string;
  email: string;
  avatar?: string;
}

/** Утилита: читаем File как dataURL */
export const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(String(e.target?.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** Набор обработчиков, который вернёт фабрика */
export interface ProfileHandlers {
  handleEdit: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleBack: () => void;
  handleInputChange: (field: keyof UserProfile, value: string) => void;
  handleAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

/**
 * Фабрика обработчиков для useProfile.
 * Создаёт функции, замкнутые на переданные состояния и сеттеры.
 * Вызывать внутри хука при каждом рендере — замыкания всегда будут видеть актуальные значения.
 */
export function buildProfileHandlers(params: {
  isEditing: boolean;
  profile: UserProfile;
  editedProfile: UserProfile;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  setEditedProfile: Dispatch<SetStateAction<UserProfile>>;
}): ProfileHandlers {
  const {
    isEditing,
    profile,
    editedProfile,
    setIsEditing,
    setProfile,
    setEditedProfile,
  } = params;

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
      [field]: value,
    }));
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setEditedProfile(prev => ({ ...prev, avatar: dataUrl }));
  };

  return {
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleAvatarChange,
  };
}

// useExhibitModal.ts
// Вынесенные типы, утилиты и фабрика обработчиков для модалки экспоната

import type React from "react";
import type { Dispatch, SetStateAction } from "react";

/** Модель экспоната (минимальная, расширяемая проектом) */
export type Exhibit = {
  title: string;
  description?: string;
  image?: string;        // по умолчанию сюда кладём превью файла (dataURL)
  [key: string]: any;    // позволяем проекту добавлять любые поля
};

/** Утилита: читаем File как dataURL */
export const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(String(e.target?.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** Набор обработчиков модалки экспоната */
export interface ExhibitModalHandlers {
  handleOpen: () => void;
  handleClose: () => void;
  handleEdit: (existing: Exhibit) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleBack: () => void;
  handleInputChange: <K extends keyof Exhibit>(field: K, value: Exhibit[K]) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: () => void;
}

/**
 * Фабрика обработчиков модалки экспоната.
 * Создаёт функции, замкнутые на переданные состояния и сеттеры.
 * imageField — в какое поле сохранять dataURL выбранного файла (по умолчанию "image").
 */
export function buildExhibitModalHandlers(params: {
  isOpen: boolean;
  exhibit: Exhibit;
  editedExhibit: Exhibit;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setExhibit: Dispatch<SetStateAction<Exhibit>>;
  setEditedExhibit: Dispatch<SetStateAction<Exhibit>>;
  onAfterSave?: (saved: Exhibit) => void; // опциональный коллбек наружу
  imageField?: keyof Exhibit;             // по умолчанию "image"
}): ExhibitModalHandlers {
  const {
    isOpen,
    exhibit,
    editedExhibit,
    setIsOpen,
    setExhibit,
    setEditedExhibit,
    onAfterSave,
    imageField = "image",
  } = params;

  const handleOpen = () => {
    setEditedExhibit(exhibit);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEdit = (existing: Exhibit) => {
    setEditedExhibit(existing);
    setIsOpen(true);
  };

  const handleSave = () => {
    setExhibit(editedExhibit);
    setIsOpen(false);
    onAfterSave?.(editedExhibit);
  };

  const handleCancel = () => {
    setEditedExhibit(exhibit);
    setIsOpen(false);
  };

  const handleBack = () => {
    if (isOpen) handleCancel();
  };

  const handleInputChange = <K extends keyof Exhibit>(field: K, value: Exhibit[K]) => {
    setEditedExhibit(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setEditedExhibit(prev => ({
      ...prev,
      [imageField]: dataUrl,
    }));
  };

  const handleRemoveImage = () => {
    setEditedExhibit(prev => {
      const next = { ...prev };
      // @ts-expect-error — поле динамическое, но мы сознательно его чистим
      next[imageField] = undefined;
      return next;
    });
  };

  return {
    handleOpen,
    handleClose,
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleImageChange,
    handleRemoveImage,
  };
}


