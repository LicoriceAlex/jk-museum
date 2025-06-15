export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
  patronymic: string;
  role?: "user";
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
