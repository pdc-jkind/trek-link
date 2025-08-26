// src/providers/AuthProvider.tsx
"use client";

import { ReactNode, createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type {
  AuthUser,
  AuthProvider as AuthProviderType,
} from "@/types/auth.types";

// Auth Context Interface
interface AuthContextType {
  user: AuthUser | null;
  fullUserProfile: any; // From Zustand store
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

// Create Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authState = useAuth();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
