import { saveToken, setAuthHeader } from "../../../utils/serviceToken";
import { apiRequest } from "../../../utils/apiRequest.ts";
import {LoginPayload, RegisterPayload, TokenResponse} from '../types/types.ts';


export const login = async (payload: LoginPayload) => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", payload.username);
  formData.append("password", payload.password);
  formData.append("scope", "");
  formData.append("client_id", "string");
  formData.append("client_secret", "string");
  
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/login/access-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    }
  );
  
  if (!response.ok) {
    return { error: true, status: response.status };
  }
  
  const data: TokenResponse = await response.json();
  saveToken(data.access_token);
  setAuthHeader(data.access_token);
  return { success: true };
};

export const register = async (payload: RegisterPayload) => {
  const fullPayload = {
    ...payload,
    role: "user",
  };
  
  const response = await apiRequest("users/signup", "POST", fullPayload);
  
  return response;
};

export const logout = () => {
  saveToken("");
  setAuthHeader("");
};
