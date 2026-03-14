export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
}

export interface AuthSession {
  token: string | null;
  user: AuthUser;
}

export interface AuthApiResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: Partial<AuthUser>;
  name?: string;
  email?: string;
}
