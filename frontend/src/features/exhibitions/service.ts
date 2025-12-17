import { getToken } from "../../utils/serviceToken.ts";

export const API_BASE = (() => {
  const env = import.meta.env.VITE_API_URL;
  if (env && typeof env === "string") {
    return env.replace(/\/+$/, "");
  }
  return "";
})();
const ORG_ID = "63456069-eac5-4841-92f0-a4d173634304";

export type CreateExhibitionRequest = {
  title: string;
  description: string;
  cover_image_key?: string;
  cover_type: "outside";
  status: "draft" | "published";
  date_template: "year";
  start_year: number;
  end_year: number;
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

  if (!res.ok) throw new Error("Не удалось создать выставку");
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

  if (!res.ok) throw new Error("Не удалось создать блок");
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

export const ORGANIZATION_ID = ORG_ID;

