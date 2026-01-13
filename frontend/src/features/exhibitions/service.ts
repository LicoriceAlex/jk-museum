import { getToken } from "../../utils/serviceToken.ts";

export const API_BASE = (() => {
  const env = import.meta.env.VITE_API_URL;
  if (env && typeof env === "string") {
    return env.replace(/\/+$/, "");
  }
  return "";
})();
const ORG_ID = "1b0dd88a-ee50-47c0-9fe2-a762112deddf";

export type CreateExhibitionRequest = {
  title: string;
  description: string;
  cover_image_key: string;
  cover_type: "outside";
  status: "draft" | "published";
  rating: number;
  settings: Record<string, any>;
  organization_id: string;
  participants: string[];
  tags: string[];
};

export type CreateExhibitionResponse = {
  id: string;
};

export type CreateBlockRequest = {
  type: string;
  content?: string;
  settings?: Record<string, any>;
  position: number;
  items?: Array<{
    image_key?: string;
    text?: string;
    position: number;
  }>;
};

export async function uploadFile(
  file: File,
  prefix = "exhibitions/"
): Promise<{ object_key: string; file_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    API_BASE
      ? `${API_BASE}/api/v1/files/upload?prefix=${encodeURIComponent(prefix)}`
      : `/api/v1/files/upload?prefix=${encodeURIComponent(prefix)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Не удалось загрузить файл");
  return res.json();
}

export async function createExhibition(
  payload: CreateExhibitionRequest
): Promise<CreateExhibitionResponse> {
  const token = getToken();
  const url = API_BASE ? `${API_BASE}/api/v1/exhibitions/` : `/api/v1/exhibitions/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Не удалось создать выставку";
    let errorDetails: any = null;
    
    try {
      const errorText = await res.text();
      console.error('[createExhibition] Error response:', res.status, errorText);
      
      if (errorText) {
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson;
          
          // Обработка разных форматов ошибок
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail)) {
              // Pydantic validation errors
              const errors = errorJson.detail.map((e: any) => {
                const field = e.loc?.join('.') || 'unknown';
                const msg = e.msg || e.type || 'ошибка';
                return `${field}: ${msg}`;
              }).join(', ');
              errorMessage = `Ошибка валидации: ${errors}`;
            } else {
              errorMessage = errorJson.detail;
            }
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorText.length < 500) {
            errorMessage = errorText;
          }
        } catch {
          // Если не JSON, используем текст
          if (errorText.length < 500) {
            errorMessage = errorText;
          }
        }
      }
    } catch (e) {
      console.error('Error reading error response:', e);
    }
    
    // Более точные сообщения об ошибках на основе статуса
    if (res.status === 401) {
      errorMessage = "Ошибка авторизации. Токен истек или недействителен. Пожалуйста, войдите в систему заново.";
    } else if (res.status === 403) {
      errorMessage = "У вас нет прав на создание выставки для этой организации. Проверьте выбранную организацию в настройках аккаунта.";
    } else if (res.status === 422) {
      // Сохраняем детали ошибки валидации
      console.error('[createExhibition] Validation error details:', errorDetails);
      if (!errorMessage.includes('Ошибка валидации')) {
        errorMessage = errorMessage || "Неверные данные. Проверьте заполнение всех полей.";
      }
    }
    
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function createBlock(
  exhibitionId: string,
  payload: CreateBlockRequest
): Promise<void> {
  const token = getToken();
  const url = API_BASE
    ? `${API_BASE}/api/v1/exhibitions/${exhibitionId}/blocks/`
    : `/api/v1/exhibitions/${exhibitionId}/blocks/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ ...payload, exhibition_id: exhibitionId }),
  });

  if (!res.ok) {
    let errorMessage = "Не удалось создать блок";
    let errorDetails: any = null;
    
    try {
      const errorText = await res.text();
      console.error('[createBlock] Error response:', res.status, errorText);
      
      if (errorText) {
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson;
          
          // Обработка разных форматов ошибок
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail)) {
              // Pydantic validation errors
              const errors = errorJson.detail.map((e: any) => {
                const field = e.loc?.join('.') || 'unknown';
                const msg = e.msg || e.type || 'ошибка';
                return `${field}: ${msg}`;
              }).join(', ');
              errorMessage = `Ошибка валидации: ${errors}`;
            } else {
              errorMessage = errorJson.detail;
            }
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorText.length < 500) {
            errorMessage = errorText;
          }
        } catch {
          // Если не JSON, используем текст
          if (errorText.length < 500) {
            errorMessage = errorText;
          }
        }
      }
    } catch (e) {
      console.error('Error reading error response:', e);
    }
    
    // Более точные сообщения об ошибках на основе статуса
    if (res.status === 401) {
      errorMessage = "Ошибка авторизации. Токен истек или недействителен. Пожалуйста, войдите в систему заново.";
    } else if (res.status === 403) {
      errorMessage = "У вас нет прав на создание блока для этой выставки.";
    } else if (res.status === 422) {
      console.error('[createBlock] Validation error details:', errorDetails);
      if (!errorMessage.includes('Ошибка валидации')) {
        errorMessage = errorMessage || "Неверные данные. Проверьте заполнение всех полей.";
      }
    }
    
    throw new Error(errorMessage);
  }
}

export async function fetchExhibitions() {
  const token = getToken();
  const url = API_BASE
    ? `${API_BASE}/api/v1/exhibitions/?skip=0&limit=100&organization_id=${ORG_ID}&sortBy=created_at&sortOrder=desc`
    : `/api/v1/exhibitions/?skip=0&limit=100&organization_id=${ORG_ID}&sortBy=created_at&sortOrder=desc`;
  const res = await fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Не удалось загрузить выставки");
  return res.json();
}

export async function fetchExhibitionById(id: string) {
  const token = getToken();
  const url = API_BASE
    ? `${API_BASE}/api/v1/exhibitions/${id}`
    : `/api/v1/exhibitions/${id}`;
  const res = await fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Не удалось загрузить выставку");
  return res.json();
}

export async function updateExhibition(
  id: string,
  payload: CreateExhibitionRequest
): Promise<void> {
  const token = getToken();
  const url = API_BASE
    ? `${API_BASE}/api/v1/exhibitions/${id}`
    : `/api/v1/exhibitions/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Не удалось обновить выставку");
}

export async function updateBlockOnServer(
  exhibitionId: string,
  blockId: string,
  payload: CreateBlockRequest
): Promise<void> {
  const token = getToken();
  const url = API_BASE
    ? `${API_BASE}/api/v1/exhibitions/${exhibitionId}/blocks/${blockId}`
    : `/api/v1/exhibitions/${exhibitionId}/blocks/${blockId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ ...payload, exhibition_id: exhibitionId }),
  });

  if (!res.ok) throw new Error("Не удалось обновить блок");
}

export async function deleteBlock(
  exhibitionId: string,
  blockId: string
): Promise<void> {
  const token = getToken();
  const url = API_BASE
    ? `${API_BASE}/api/v1/exhibitions/${exhibitionId}/blocks/${blockId}`
    : `/api/v1/exhibitions/${exhibitionId}/blocks/${blockId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Не удалось удалить блок");
}

export const ORGANIZATION_ID = ORG_ID;