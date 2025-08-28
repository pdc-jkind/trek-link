// src\app\(auth)\components\AuthProvider.tsx
"use client";

import { ReactNode, createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type {
  AuthUser,
  AuthProvider as AuthProviderType,
} from "@/types/auth.types";
import type { User } from "@/types/user.types";

// Auth Context Interface
interface AuthContextType {
  // Auth session data
  user: AuthUser | null;
  // Complete user profile from store
  userProfile: User | null;
  // Loading and authentication states
  isLoading: boolean;
  isAuthenticated: boolean;
  isFullyAuthenticated: boolean;
  // Error handling
  error: string | null;
  // Actions
  login: (provider?: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

// Create Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    isFullyAuthenticated,
    error,
    login,
    logout,
    clearError,
    refreshProfile,
  } = useAuth();

  const contextValue: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    isFullyAuthenticated,
    error,
    login,
    logout,
    clearError,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

// Helper hooks for specific use cases
export const useAuthUser = () => {
  const { user } = useAuthContext();
  return user;
};

export const useUserProfile = () => {
  const { userProfile } = useAuthContext();
  return userProfile;
};

export const useAuthStatus = () => {
  const { isAuthenticated, isFullyAuthenticated, isLoading } = useAuthContext();
  return { isAuthenticated, isFullyAuthenticated, isLoading };
};
