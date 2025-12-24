// useExhibitModal.ts
import { useState } from "react";
import { buildExhibitModalHandlers, type Exhibit } from "../../layouts/AuthLayout/function.ts";

/**
 * Хук состояния модалки экспоната.
 * initial — начальные поля для нового экспоната
 * onAfterSave — опциональный коллбек наружу (например, чтобы дернуть refetch)
 * imageField — в какое поле писать превью выбранного файла (по умолчанию "image")
 */
export const useExhibitModal = (
  initial?: Partial<Exhibit>,
  onAfterSave?: (saved: Exhibit) => void,
  imageField: keyof Exhibit = "image"
) => {
  const [isOpen, setIsOpen] = useState(false);

  const [exhibit, setExhibit] = useState<Exhibit>({
    title: "",
    ...initial,
  } as Exhibit);

  const [editedExhibit, setEditedExhibit] = useState<Exhibit>(exhibit);

  // Подключаем вынесённые функции (фабрика обработчиков)
  const {
    handleOpen,
    handleClose,
    handleEdit,
    handleSave,
    handleCancel,
    handleBack,
    handleInputChange,
    handleImageChange,
    handleRemoveImage,
  } = buildExhibitModalHandlers({
    isOpen,
    exhibit,
    editedExhibit,
    setIsOpen,
    setExhibit,
    setEditedExhibit,
    onAfterSave,
    imageField,
  });

  return {
    // state
    isOpen,
    exhibit,
    editedExhibit,

    // handlers
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
};

export type { Exhibit } from "./function";
