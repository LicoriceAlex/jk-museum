import { getToken } from "../../utils/serviceToken.ts";

const API_BASE = (() => {
  const env = import.meta.env.VITE_API_URL;
  if (env && typeof env === "string") {
    return env.replace(/\/+$/, "");
  }
  return "";
})();

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  profile_image_key: string | null;
  about_me: string | null;
  status: string;
  role: string;
  created_at: string;
}

export interface UserProfileUpdate {
  name?: string;
  surname?: string;
  profile_image_key?: string;
  about_me?: string;
  email?: string;
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("Требуется авторизация");
  }

  const url = API_BASE
    ? `${API_BASE}/api/v1/users/me/profile`
    : `/api/v1/users/me/profile`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить профиль");
  }

  return res.json();
}

export async function updateUserProfile(
  data: UserProfileUpdate
): Promise<UserProfileResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("Требуется авторизация");
  }

  const url = API_BASE
    ? `${API_BASE}/api/v1/users/me/profile`
    : `/api/v1/users/me/profile`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Не удалось обновить профиль");
  }

  return res.json();
}

export async function uploadProfileImage(
  file: File
): Promise<{ object_key: string; file_url: string }> {
  const token = getToken();
  if (!token) {
    throw new Error("Требуется авторизация");
  }

  const formData = new FormData();
  formData.append("file", file);

  const url = API_BASE
    ? `${API_BASE}/api/v1/files/upload?prefix=${encodeURIComponent("users/")}`
    : `/api/v1/files/upload?prefix=${encodeURIComponent("users/")}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить изображение");
  }

  return res.json();
}

export function getFileUrl(objectKey: string | null): string {
  if (!objectKey) {
    return "/api/placeholder/200/200";
  }

  const baseUrl = API_BASE || "";
  return `${baseUrl}/api/v1/files/${objectKey}`;
}

