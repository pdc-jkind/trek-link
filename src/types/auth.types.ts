// src/types/auth.types.ts
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export type AuthProvider = 'google' | 'github' | 'facebook';

export interface AuthCallbackParams {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}