import { getToken } from './serviceToken.ts';

const apiBase = (() => {
  const env = import.meta.env.VITE_API_URL;
  if (env && typeof env === 'string') {
    return env.replace(/\/+$/, '');
  }
  return '';
})();

export const apiRequest = async (
  endpoint: string,
  method = "POST",
  body?: object | FormData,
  authRequired = false
) => {
  try {
    const headers: Record<string, string> = {};
    
    if (authRequired) {
      const token = getToken();
      if (!token) throw new Error("Требуется авторизация");
      headers.Authorization = `Bearer ${token}`;
    }
    
    const options: RequestInit = {
      method,
      headers,
    };
    
    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else if (["POST", "PUT", "PATCH"].includes(method)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    }
    
    const url = apiBase
      ? `${apiBase}/api/v1/${endpoint}`
      : `/api/v1/${endpoint}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      return { error: true, status: response.status };
    }
    
    return response.json();
  } catch (error) {
    console.error(`Ошибка запроса (${endpoint}):`, error);
    return { error: true, status: null };
  }
};
